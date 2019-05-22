import { ApolloClient, gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

import { IconButton, MenuItem, Typography } from '@material-ui/core';
import { AddPhotoAlternate, Delete } from '@material-ui/icons';

import {
  AddImageDetails, AddImageDetails_insert_jotts_image, AddImageDetailsVariables
} from '../../apollo-types/AddImageDetails';
import {
  DeleteImageMuatation, DeleteImageMuatation_delete_jotts_image, DeleteImageMuatationVariables
} from '../../apollo-types/DeleteImageMuatation';
import {
  GetAllUserImages, GetAllUserImages_jotts_image, GetAllUserImagesVariables
} from '../../apollo-types/GetAllUserImages';
import { CookieUser } from '../../types';
import { ImageS3 } from '../../utils/agent';
import { s3ImagePrefix } from '../../vars';
import { BaseMRSelect } from '../MaterialReactSelect';

const getAllUserImages = gql`
query GetAllUserImages($authorId: uuid!){
    jotts_image(where:{author_id:{_eq: $authorId}}) {
        id
        author_id
        name
    }
}
`

const addImageDetails = gql`
mutation AddImageDetails($imageId: String!, $name: String!){
    insert_jotts_image(objects: [{id: $imageId, name: $name}]) {
        affected_rows
    }
}
`

async function addImage(client: ApolloClient<any>, imageId: string, name: string) {
    return (await client.mutate<AddImageDetails, AddImageDetailsVariables>({
        mutation: addImageDetails,
        variables: { imageId, name }
    })) as AddImageDetails_insert_jotts_image
}

const deleteImageMutation = gql`
mutation DeleteImageMuatation($imgId: String!){
    delete_jotts_image(where: {id:{_eq: $imgId}}) {
        affected_rows
    }
}
`

async function deleteImage(client: ApolloClient<any>, imgId: string) {
    return (await client.mutate<DeleteImageMuatation, DeleteImageMuatationVariables>({
        mutation: deleteImageMutation,
        variables: { imgId }
    })) as DeleteImageMuatation_delete_jotts_image
}

interface Props {
    user: CookieUser,
    value: string | null,
    onChange?: (imgId: string | null) => any,
    label?: string
}


class SelectImage extends React.Component<Props> {
    render() {
        const { user, value } = this.props;
        return (
            <Query<GetAllUserImages, GetAllUserImagesVariables>
                query={getAllUserImages}
                variables={{ authorId: user.id }}
            >
                {({ data, error, loading, client }) => {
                    if (error) {
                        return <div>{error.message}</div>
                    }
                    if (loading) {
                        return <div>Loading...</div>
                    }
                    if (!data) {
                        return null
                    }
                    const selectedImage = value ? data.jotts_image.find(i => i.id === value) : undefined
                    return (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <BaseMRSelect
                                defaultOptions={data.jotts_image.map(i => ({ label: i.name, value: i }))}
                                value={selectedImage ? [{ label: selectedImage.name, value: selectedImage }] : []}
                                onChange={(v) => {
                                    const selectedImage = v && v.length > 0 ? v[0].value : undefined;
                                    if (this.props.onChange) {
                                        return selectedImage ? this.props.onChange(selectedImage.id) : this.props.onChange(null)
                                    }
                                }}
                                label={this.props.label}
                                placeholder="Select Image..."
                                SingleValueComponent={props => {
                                    const val = props.hasValue ? props.getValue() : undefined;
                                    const img: GetAllUserImages_jotts_image | undefined = val ? val instanceof Array ? val[0].value : val.value : undefined
                                    return (
                                        <div style={{ display: 'flex', height: 64, alignItems: 'center' }}>
                                            {
                                                img ?
                                                    (
                                                        <img src={`${s3ImagePrefix}/${img.id}`} style={{ width: 64, height: 64 }} />
                                                    ) : null
                                            }
                                            <Typography className={props.selectProps.classes.singleValue} {...props.innerProps} style={{ margin: 4 }}>
                                                {props.children}
                                            </Typography>
                                        </div>
                                    );
                                }}
                                OptionComponent={(props) => {
                                    const img: GetAllUserImages_jotts_image = props.data.value
                                    const val = props.hasValue ? props.getValue() : undefined;
                                    const selectedImg: GetAllUserImages_jotts_image | undefined = val ? val instanceof Array ? val[0].value : val.value : undefined
                                    return (
                                        <MenuItem
                                            buttonRef={props.innerRef}
                                            selected={props.isFocused}
                                            component="div"
                                            style={{
                                                fontWeight: props.isSelected ? 500 : 400,
                                                height: 64,
                                                display: 'flex'
                                            }}
                                            {...props.innerProps}>
                                            <img src={`${s3ImagePrefix}/${img.id}`} style={{ width: 64, height: 64 }} />
                                            <div style={{ flex: 1, margin: 4 }}>
                                                {props.children}
                                            </div>
                                            <IconButton onClick={e => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                ImageS3.deleteImageS3(img.id).then(r => {
                                                    if (r) {
                                                        deleteImage(client, img.id).then(res => {
                                                            const allUserImages = client.readQuery<GetAllUserImages, GetAllUserImagesVariables>({ query: getAllUserImages, variables: { authorId: user.id } });
                                                            client.writeQuery<GetAllUserImages, GetAllUserImagesVariables>({
                                                                query: getAllUserImages,
                                                                variables: { authorId: user.id },
                                                                data: { jotts_image: allUserImages ? allUserImages.jotts_image.filter(i => i.id !== img.id) : [] }
                                                            });
                                                            if (selectedImg && selectedImg.id === img.id) {
                                                                props.clearValue()
                                                            }
                                                        }
                                                        ).catch(e =>
                                                            window.alert("Deleting Image entry failed")
                                                        )
                                                    } else {
                                                        window.alert("Deleting Image failed")
                                                    }
                                                })
                                            }}>
                                                <Delete />
                                            </IconButton>
                                        </MenuItem>
                                    )
                                }}
                            />

                            <IconButton component="label">
                                <AddPhotoAlternate />
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={e => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            const img = e.target.files[0]
                                            if (img.size > 1024 * 512) {
                                                e.target.value = ''
                                                window.alert("File too big")
                                            } else {
                                                ImageS3.addImageS3(img)
                                                    .then(imgId => {
                                                        if (imgId) {
                                                            const imgName = img.name;
                                                            addImage(client, imgId, imgName).then(d => {
                                                                const allUserImages = client.readQuery<GetAllUserImages, GetAllUserImagesVariables>({ query: getAllUserImages, variables: { authorId: user.id } });
                                                                const newImage: GetAllUserImages_jotts_image = { __typename: 'jotts_image', author_id: user.id, id: imgId, name: imgName }
                                                                client.writeQuery<GetAllUserImages, GetAllUserImagesVariables>({
                                                                    query: getAllUserImages,
                                                                    variables: { authorId: user.id },
                                                                    data: { jotts_image: [...(allUserImages ? allUserImages.jotts_image : []), newImage] }
                                                                });
                                                                if (this.props.onChange) {
                                                                    this.props.onChange(newImage.id)
                                                                }
                                                            })
                                                        }
                                                    })
                                            }
                                        }
                                    }}
                                />
                            </IconButton>
                        </div>
                    )
                }}
            </Query>
        )
    }
}

export default SelectImage;
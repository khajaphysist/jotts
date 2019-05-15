import { ApolloClient, gql } from 'apollo-boost';
import React from 'react';
import { Query } from 'react-apollo';

import { IconButton } from '@material-ui/core';
import { AddAPhoto, AddPhotoAlternate } from '@material-ui/icons';

import {
  AddImageDetails, AddImageDetails_insert_jotts_image, AddImageDetailsVariables
} from '../../apollo-types/AddImageDetails';
import {
  GetAllUserImages, GetAllUserImages_jotts_image, GetAllUserImagesVariables
} from '../../apollo-types/GetAllUserImages';
import { CookieUser } from '../../types';
import { getUserToken } from '../../utils/loginStateProvider';
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

function updateAllUserImagesCache(client: ApolloClient<any>, authorId: string) {
    const allUserImages = client.readQuery<GetAllUserImages, GetAllUserImagesVariables>({ query: getAllUserImages, variables: { authorId } });

}

interface Props {
    user: CookieUser,
    value?: string,
    onChange?: (imgId: string) => any
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
                        <div style={{ display: 'flex' }}>
                            <BaseMRSelect
                                defaultOptions={data.jotts_image.map(i => ({ label: i.name, value: i }))}
                                value={selectedImage ? [{ label: selectedImage.name, value: selectedImage }] : []}
                                onChange={(v) => {
                                    const selectedImage = v && v.length > 0 ? v[0].value : undefined;
                                    if (selectedImage && this.props.onChange) {
                                        this.props.onChange(selectedImage.id)
                                    }
                                }}
                                placeholder="Select Image..."
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
                                                this.addImage(img)
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
    async addImage(img: File) {


        const formData = new FormData();
        formData.append('image', img);
        formData.append('name', img.name)
        const res = await fetch('/image', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${getUserToken()}`
            },
            body: formData
        })
        if (res.status !== 200) {
            window.alert("Failed to upload")
        } else {
            const imgId = await res.text();
            return imgId
        }

    }
}

export default SelectImage;
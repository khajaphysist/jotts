import { ApolloClient, gql } from 'apollo-boost';
import { debounce, difference } from 'lodash';
import dynamic from 'next/dynamic';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import slugify from 'slug';

import { InputBase, Paper } from '@material-ui/core';
import { InputBaseProps } from '@material-ui/core/InputBase';

import {
  AddPostTagMutation, AddPostTagMutationVariables
} from '../../apollo-types/AddPostTagMutation';
import {
  DeletePostTagMutation, DeletePostTagMutationVariables
} from '../../apollo-types/DeletePostTagMutation';
import { EditPost, EditPostVariables } from '../../apollo-types/EditPost';
import { GetPost, GetPost_jotts_post_by_pk, GetPostVariables } from '../../apollo-types/GetPost';
import { jotts_tag_constraint, jotts_tag_update_column } from '../../apollo-types/globalTypes';
import { loggedInUser } from '../../utils/loginStateProvider';
import { createMessageValue, deserializeValue, EditorValue, serializeValue } from '../JottsEditor';

const JottsEditor = dynamic(() => import('../JottsEditor'), { ssr: false })
const SelectTags = dynamic(() => import('../apollo/SelectTags'), { ssr: false })

export const DEFAULT_VALUE = createMessageValue("Start Jotting...");
export const generateSlug = (title: string, id: string) => slugify(title + '-' + id);

function TitleInput(props: InputBaseProps) {
    return (
        <Paper style={{
            padding: 4
        }}>
            <InputBase {...props} fullWidth/>
        </Paper>
    )
}

const getPost = gql`
query GetPost($id: uuid!){
    jotts_post_by_pk(id: $id) {
        id
        title
        slug
        content
        post_tags {
            tag
        }
    }
}
`
const editPostMutation = gql`
mutation EditPost($id: uuid!, $title: String!, $slug: String!, $content: String){
    update_jotts_post(
        where: {id: {_eq: $id}},
        _set: {title: $title,slug:$slug,content:$content}
        ) {
            affected_rows
            returning {
                id
                title
                content
            }
    }
}
`

const addPostTagMutation = gql`
mutation AddPostTagMutation($objects: [jotts_post_tag_insert_input!]!){
    insert_jotts_post_tag(objects: $objects,) {
        affected_rows
        returning {
            post_id
            tag
        }
    }
}
`

const deletePostTagMutation = gql`
mutation DeletePostTagMutation($postId: uuid,!, $tag: String!){
    delete_jotts_post_tag(where: {post_id: {_eq: $postId}, tag: {_eq: $tag}}) {
        affected_rows
        returning {
            post_id
            tag
        }
    }
}
`

interface ComponentProps {
    postId: string
}

type Props = ComponentProps;
interface State {
    id: string;
    title: string;
    content: EditorValue
    slug: string;
    tags: string[];
}

class EditPostComponent extends React.Component<Props, State> {
    private client: ApolloClient<any> | undefined
    constructor(props: Props) {
        super(props)
        this.state = {
            id: '',
            title: '',
            slug: '',
            content: DEFAULT_VALUE,
            tags: [],
        }
    }
    render() {
        return (
            <ApolloConsumer>
                {client => {
                    if (!this.client) {
                        this.client = client
                    }
                    return (
                        <div>
                            <TitleInput placeholder="Title"
                                value={this.state.title}
                                onChange={
                                    (e) =>
                                        this.setState({
                                            ...this.state,
                                            title: e.target.value,
                                            slug: generateSlug(e.target.value, this.state.id)
                                        },
                                            () => this.updatePost(client))
                                } />
                            <SelectTags
                                value={this.state.tags}
                                onChange={async (newTags) => {
                                    const { tags } = this.state
                                    if (newTags.length > tags.length) {
                                        const diffTags = difference(newTags, tags);
                                        await this.addPostTag(diffTags)
                                    } else {
                                        const diffTags = difference(tags, newTags);
                                        await Promise.all(diffTags.map(tag => this.deletePostTag(tag)))
                                    }
                                    this.updateCachePostTags(newTags, client)
                                    this.setState({ ...this.state, tags: newTags })
                                }}
                            />
                            <JottsEditor value={this.state.content} onChange={({ value }) => {
                                const updateDB = this.state.content.document !== value.document
                                this.setState({ ...this.state, content: value }, () => {
                                    if (updateDB) {
                                        this.updatePost(client)
                                    }
                                })
                            }} />
                        </div>
                    )
                }}
            </ApolloConsumer>
        )
    }

    componentDidMount() {
        this.getEditPost()
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.postId === prevProps.postId) {
            return
        }
        this.getEditPost()
    }

    getEditPost() {
        const { client } = this;
        if (!client) {
            return;
        }
        const { postId } = this.props;
        client.query<GetPost, GetPostVariables>({
            query: getPost,
            variables: { id: this.props.postId }
        }).then(res => {
            if (res.data.jotts_post_by_pk) {
                const { content, post_tags, slug, title } = res.data.jotts_post_by_pk
                const newValue = content ? deserializeValue(content) : DEFAULT_VALUE;
                this.setState({ ...this.state, id: postId, title, slug, content: newValue, tags: post_tags.map(t => t.tag) })
            } else {
                console.log(res.errors)
            }
        }).catch(e => {
            console.log(e)
        });
    }

    updateCachePostTags = (newTags: string[], client: ApolloClient<any>) => {
        const variables = { id: this.props.postId };
        const oldData = client.readQuery<GetPost, GetPostVariables>({ query: getPost, variables });
        if (oldData && oldData.jotts_post_by_pk) {
            const oldPost = oldData.jotts_post_by_pk;
            const newPost: GetPost_jotts_post_by_pk = { ...oldPost, post_tags: newTags.map(tag => ({ __typename: 'jotts_post_tag' as const, tag })) };
            client.writeQuery<GetPost, GetPostVariables>({ query: getPost, variables, data: { jotts_post_by_pk: newPost } })
        }
    }

    addPostTag = async (tags: string[]) => {
        const user = loggedInUser();
        const { client } = this
        if (user && client) {
            const postId = this.state.id
            await client.mutate<AddPostTagMutation, AddPostTagMutationVariables>({
                mutation: addPostTagMutation,
                variables: {
                    objects: tags.map(tag => ({
                        post_id: postId,
                        tagByTag: {
                            data: { tag },
                            on_conflict: { constraint: jotts_tag_constraint.tag_pkey, update_columns: [jotts_tag_update_column.tag] }
                        }
                    }))
                }
            });
        }
    }

    deletePostTag = async (tag: string) => {
        const user = loggedInUser();
        const { client } = this
        if (user && client) {
            const postId = this.state.id
            await client.mutate<DeletePostTagMutation, DeletePostTagMutationVariables>({
                mutation: deletePostTagMutation,
                variables: { postId, tag }
            });
        }
    }

    updatePost = debounce(async (client: ApolloClient<any>) => {
        if (this.state.id) {
            const { id, title, slug, content } = this.state
            const s = serializeValue(content);
            const res = await client.mutate<EditPost, EditPostVariables>({
                mutation: editPostMutation,
                variables: { id, title, slug, content: s }
            });
        }
    }, 1000)
}

export default EditPostComponent;
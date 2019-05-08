import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import slugify from 'slug';
import uuidv4 from 'uuid/v4';

import { InputBase, Paper } from '@material-ui/core';
import { InputBaseProps } from '@material-ui/core/InputBase';

import { getUserPosts } from '../../../pages/dashboard';
import { EditPost, EditPostVariables } from '../../apollo-types/EditPost';
import { GetPost, GetPostVariables } from '../../apollo-types/GetPost';
import {
  GetUserPosts, GetUserPosts_jotts_post, GetUserPostsVariables
} from '../../apollo-types/GetUserPosts';
import { NewPost, NewPostVariables } from '../../apollo-types/NewPost';
import { loggedInUser } from '../../utils/loginStateProvider';
import { createMessageValue, deserializeValue, EditorValue, serializeValue } from '../JottsEditor';

const JottsEditor = dynamic(() => import('../JottsEditor'), { ssr: false })
const SelectTags = dynamic(() => import('../apollo/SelectTags'), { ssr: false })

const DEFAULT_TITLE = 'untitled';
const DEFAULT_VALUE = createMessageValue("Start Jotting...");

const generateSlug = (title: string, id: string) => slugify(title + '-' + id);
export const getEditPostUrl = (handle: string, postId: string) => ({ href: `/dashboard?handle=${handle}&post_id=${postId}`, as: `/${handle}/dashboard/${postId}` })

function TitleInput(props: InputBaseProps) {
    return (
        <Paper style={{
            padding: 4
        }}>
            <InputBase {...props} />
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

const newPostMutation = gql`
mutation NewPost($authorId: uuid!, $title: String!, $slug: String!, $content: String!, $id: uuid!){
    insert_jotts_post(objects: [{author_id: $authorId, title: $title, slug: $slug, content: $content, id: $id}]) {
        affected_rows
        returning {
            id
            title
            content
        }
    }
}
`
interface EditPostActionTypeProps {
    action: { type: "new" } | { type: "edit", postId: string },
    variables: GetUserPostsVariables
}

interface ComponentProps extends EditPostActionTypeProps {
    client: ApolloClient<any>
}

type Props = ComponentProps;
interface State {
    id: string;
    title: string;
    content: EditorValue
    slug: string;
    tags: string[];
    loading: boolean;
    error: boolean;
    message: string;
}

class EditPostComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = {
            id: '',
            title: '',
            slug: '',
            content: DEFAULT_VALUE,
            tags: [],
            loading: true,
            message: 'Loading...',
            error: false,
        }
    }
    render() {
        return this.state.loading || this.state.error ? (<div>{this.state.message}</div>) : (
            <div style={{ maxWidth: 1200, minWidth: 900 }}>
                <TitleInput placeholder="Title"
                    value={this.state.title}
                    onChange={
                        (e) =>
                            this.setState({
                                ...this.state,
                                title: e.target.value,
                                slug: generateSlug(e.target.value, this.state.id)
                            },
                                () => this.updatePost(this.props.client))
                    } />
                <SelectTags defaultSelected={this.state.tags} onChange={tags => this.setState({ ...this.state, tags })} />
                <JottsEditor value={this.state.content} onChange={({ value }) => {
                    const updateDB = this.state.content.document !== value.document
                    this.setState({ ...this.state, content: value }, () => {
                        if (updateDB) {
                            this.updatePost(this.props.client)
                        }
                    })
                }} />
            </div>
        )
    }

    componentDidMount() {
        this.handleActions()
    }

    componentDidUpdate(prevProps: Props) {
        if ((this.props.action.type === 'edit' && prevProps.action.type === 'edit' && this.props.action.postId === prevProps.action.postId) ||
            this.props.action.type === 'new' && prevProps.action.type === 'new') {
            return
        }
        this.handleActions()
    }

    handleActions() {
        console.log("Handle actions called")
        switch (this.props.action.type) {
            case 'edit':
                this.getEditPost()
                break;
            case 'new':
                this.createNewPost()
                break;
            default:
                break;
        }
    }

    getEditPost() {
        if (this.props.action.type === 'edit') {
            const { client } = this.props;
            const postId = this.props.action.postId;
            client.query<GetPost, GetPostVariables>({
                query: getPost,
                variables: { id: this.props.action.postId }
            }).then(res => {
                if (res.data.jotts_post_by_pk) {
                    const { content, post_tags, slug, title } = res.data.jotts_post_by_pk
                    const newValue = content ? deserializeValue(content) : DEFAULT_VALUE;
                    this.setState({ ...this.state, id: postId, title, slug, content: newValue, tags: post_tags.map(t => t.tag), loading: false })
                } else {
                    this.setState({ ...this.state, loading: false, message: res.errors ? res.errors.map(e => e.toString()).join('\n') : 'Unknown error occurred', error: true })
                }
            }).catch(e => {
                console.log(e)
                this.setState({ ...this.state, loading: false, error: true, message: e.toString() })
            });
        }
    }

    createNewPost() {
        if (this.props.action.type === 'new') {
            const { client, variables } = this.props;
            const user = loggedInUser();
            if (user) {
                const id = uuidv4();
                const title = DEFAULT_TITLE;
                const slug = generateSlug(title, id);
                const content = serializeValue(DEFAULT_VALUE)
                client.mutate<NewPost, NewPostVariables>({
                    mutation: newPostMutation,
                    variables: { authorId: user.id, id, content, slug, title }
                }).then(res => {
                    this.setState({ ...this.state, id, title, slug, content: DEFAULT_VALUE, tags: [], loading: false })
                    const { href, as } = getEditPostUrl(user.handle, id);
                    const allPosts = client.cache.readQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables })
                    if(allPosts && allPosts.jotts_post.length >= variables.size){
                        allPosts.jotts_post.shift()
                    }
                    const newPost: GetUserPosts_jotts_post = { __typename: 'jotts_post', content, id, post_tags: [], slug, title }
                    const data: GetUserPosts = { jotts_post: allPosts ? [...allPosts.jotts_post, newPost] : [newPost] }
                    client.cache.writeQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables, data })
                    Router.replace(href, as)
                })
                    .catch(e => console.log(e));
            }
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

class EditPostWithClient extends React.Component<EditPostActionTypeProps>{
    render() {
        return (
            <ApolloConsumer>
                {client => (
                    <EditPostComponent {...this.props} client={client} />
                )}
            </ApolloConsumer>
        )
    }
}

export default EditPostWithClient;
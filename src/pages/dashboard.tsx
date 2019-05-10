import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import { GetInitialProps, NextContext } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { Mutation, Query, withApollo } from 'react-apollo';
import uuidv4 from 'uuid/v4';

import {
  createStyles, Divider, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction,
  ListItemText, Menu, MenuItem, TextField, Theme, withStyles, WithStyles
} from '@material-ui/core';
import { ListItemProps } from '@material-ui/core/ListItem';
import {
  Check as CheckIcon, CreateNewFolder as FolderAddIcon, Delete as DeleteIcon, Folder as FolderIcon,
  FolderOpen as FolderOpenIcon, LibraryBooks as LibraryBooksIcon, MoreVert as MoreIcon,
  Note as NoteIcon, NoteAdd as NoteAddIcon
} from '@material-ui/icons';

import {
  DeleteCollectionMutation, DeleteCollectionMutationVariables
} from '../common/apollo-types/DeleteCollectionMutation';
import { DeletePost, DeletePostVariables } from '../common/apollo-types/DeletePost';
import {
  EditCollectionMutation, EditCollectionMutationVariables
} from '../common/apollo-types/EditCollectionMutation';
import {
  GetCollectionPosts, GetCollectionPosts_jotts_collection_post, GetCollectionPostsVariables
} from '../common/apollo-types/GetCollectionPosts';
import {
  GetUserCollections, GetUserCollections_jotts_collection, GetUserCollectionsVariables
} from '../common/apollo-types/GetUserCollections';
import {
  GetUserPosts, GetUserPosts_jotts_post, GetUserPostsVariables
} from '../common/apollo-types/GetUserPosts';
import {
  NewCollectionMutation, NewCollectionMutationVariables
} from '../common/apollo-types/NewCollectionMutation';
import { NewPost, NewPostVariables } from '../common/apollo-types/NewPost';
import EditPost, {
  DEFAULT_VALUE, generateSlug, getEditPostUrl
} from '../common/components/apollo/EditPost';
import { serializeValue } from '../common/components/JottsEditor';
import Layout from '../common/components/Layout';
import { CookieUser } from '../common/types';
import { loggedInUser } from '../common/utils/loginStateProvider';

const getUserPosts = gql`
query GetUserPosts($authorId: uuid!) {
    jotts_post(where: {author_id:{_eq:$authorId}}) {
        id
        slug
        title
        content
        post_tags {
            tag
        }
    }
}
`

const getCollectionPosts = gql`
query GetCollectionPosts($collectionId: uuid!){
    jotts_collection_post(where:{collection_id:{_eq:$collectionId}}) {
        collection_id
        post {
            id
            title
        }
    }
}
`

const getUserCollections = gql`
query GetUserCollections($authorId: uuid!){
    jotts_collection(where:{author_id:{_eq:$authorId}}) {
        id
        title
        slug
    }
}
`

const newCollectionMutation = gql`
mutation NewCollectionMutation($title:String!, $slug:String!, $authorId: uuid!, $id: uuid!){
    insert_jotts_collection(objects: [{title: $title, slug:$slug, author_id:$authorId, id:$id}]) {
        affected_rows
        returning {
            id
        }
    }
}
`

const editCollectionMutation = gql`
mutation EditCollectionMutation($id:uuid!, $title: String!, $slug: String!){
    update_jotts_collection(where: {id:{_eq: $id}}, _set:{title:$title, slug:$slug}) {
        affected_rows
        returning {
            id
            title
            slug
        }
    }
}
`

const deleteCollectionMutation = gql`
mutation DeleteCollectionMutation($id: uuid!){
    delete_jotts_collection(where: {id: {_eq: $id}}) {
        affected_rows
    }
}
`

const newPostMutation = gql`
mutation NewPost($newPost: jotts_post_insert_input!){
    insert_jotts_post(objects: [$newPost]) {
        affected_rows
        returning {
            id
            title
        }
    }
}
`

const deletePostMutation = gql`
mutation DeletePost($postId: uuid!){
    delete_jotts_post(where: {id:{_eq: $postId}}) {
        affected_rows
        returning{
            id
        }
    }
}
`

interface EditableListItemProps {
    listItemProps?: ListItemProps
    initialValue: string;
    onChange: (value: string) => any;
    onDelete?: () => void
}

interface EditableListItemState {
    value: string
    edit: boolean
    anchorEl: any
}

class EditableListItem extends React.Component<EditableListItemProps, EditableListItemState> {
    constructor(props: EditableListItemProps) {
        super(props)
        this.state = { edit: false, value: this.props.initialValue, anchorEl: undefined }
    }
    handleClose = () => {
        this.setState({ ...this.state, anchorEl: undefined })
    }
    handleEdit = () => {
        this.setState({ ...this.state, edit: true, anchorEl: undefined })
    }
    handleDelete = () => {
        this.setState({ ...this.state, edit: false, anchorEl: undefined }, () => this.props.onDelete ? this.props.onDelete() : void 0)
    }
    handleFinishEdit = async () => {
        try {
            if (this.state.value !== this.props.initialValue) {
                await this.props.onChange(this.state.value)
            }
            this.setState({ ...this.state, edit: false })
        } catch (error) {
            console.log(error)
            this.setState({ ...this.state, edit: false, value: this.props.initialValue })
        }
    }
    render() {
        return (
            <ListItem
                button
                component="a"
                {...this.props.listItemProps}
            >
                <ListItemIcon>
                    {
                        this.props.listItemProps && this.props.listItemProps.selected ?
                            (<FolderOpenIcon />)
                            :
                            (<FolderIcon />)
                    }
                </ListItemIcon>
                {
                    this.state.edit ?
                        (
                            <TextField value={this.state.value}
                                onChange={
                                    e => this.setState({ ...this.state, value: e.target.value })
                                }
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        this.handleFinishEdit()
                                    }
                                }}
                            />
                        )
                        :
                        (
                            <ListItemText inset primary={this.state.value} />
                        )
                }
                <ListItemSecondaryAction>
                    {
                        this.state.edit ?
                            (
                                <IconButton
                                    onClick={this.handleFinishEdit}>
                                    <CheckIcon />
                                </IconButton>
                            ) :
                            (
                                <IconButton
                                    onClick={(e) => {
                                        this.setState({ ...this.state, anchorEl: e.currentTarget })
                                    }}>
                                    <MoreIcon />
                                </IconButton>
                            )
                    }
                    <Menu
                        open={Boolean(this.state.anchorEl)}
                        onBackdropClick={this.handleClose}
                        anchorEl={this.state.anchorEl}
                    >
                        <MenuItem onClick={this.handleEdit}>Edit</MenuItem>
                        <MenuItem onClick={this.handleDelete}>Delete</MenuItem>
                    </Menu>
                </ListItemSecondaryAction>
            </ListItem>
        )
    }
    componentDidUpdate(prevProps: EditableListItemProps) {
        if (prevProps.initialValue !== this.props.initialValue) {
            this.setState({ ...this.state, value: this.props.initialValue })
        }
    }
}

const styles = (theme: Theme) => createStyles({
    addButton: {
        position: 'absolute',
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4
    }
});

type StyleProps = WithStyles<typeof styles>

type Props = StyleProps & InitialProps & { client: ApolloClient<any> };

interface InitialProps {
    postId: string | undefined,
    collectionId: string | undefined
}

const getQueryParm = (query: string | string[] | undefined) =>
    query instanceof Array ? (query.length > 0 ? query[0] : undefined) : query;

const getInitialProps: GetInitialProps<InitialProps, NextContext> = context => {
    const { post_id, collection_id } = context.query;
    const postId = getQueryParm(post_id);
    const collectionId = getQueryParm(collection_id);
    return { postId, collectionId }
}

class DashBoard extends React.Component<Props> {
    public static getInitialProps = getInitialProps
    render() {
        const user = loggedInUser();
        if (!user) {
            return null;
        }
        const { classes } = this.props;
        return (
            <Layout>
                <div>
                    <div style={{ display: 'flex' }}>
                        <List component="nav" style={{ width: 300, height: 500 }}>
                            <ListItem button onClick={() => Router.push(`/dashboard?collection_id=all`)}>
                                <ListItemIcon>
                                    <LibraryBooksIcon />
                                </ListItemIcon>
                                <ListItemText inset primary="All Notes" />
                            </ListItem>
                            <Divider />
                            <Query<GetUserCollections, GetUserCollectionsVariables> query={getUserCollections} variables={{ authorId: user.id }}>
                                {({ data, loading, error }) => {
                                    if (error) {
                                        return <div>{error.message}</div>
                                    }
                                    if (loading) {
                                        return <div>Loading...</div>
                                    }
                                    return data ? (
                                        data.jotts_collection.map(c => (
                                            <Mutation<EditCollectionMutation, EditCollectionMutationVariables> mutation={editCollectionMutation} key={c.id}>
                                                {(editCollection) => (
                                                    <EditableListItem
                                                        initialValue={c.title}
                                                        onDelete={() => this.deleteCollection(c.id, user)}
                                                        onChange={async (value) => {
                                                            await editCollection({ variables: { id: c.id, slug: generateSlug(value, c.id), title: value } })
                                                        }}
                                                        listItemProps={{
                                                            selected: this.props.collectionId === c.id,
                                                            onClick: () => Router.push(`/dashboard?collection_id=${c.id}`)
                                                        }}
                                                    />
                                                )}
                                            </Mutation>
                                        ))
                                    ) : null
                                }}
                            </Query>
                            <ListItem button component="a" onClick={() => this.createNewCollection(user)}>
                                <ListItemIcon><FolderAddIcon /></ListItemIcon>
                                <ListItemText primary={"Add"} />
                            </ListItem>
                        </List>
                        {
                            this.props.collectionId ?
                                (
                                    <List component="nav">
                                        <List component="nav" style={{ width: 300, maxHeight: 500, overflowY: "auto" }}>
                                            {
                                                this.props.collectionId === 'all' ?
                                                    (
                                                        <Query<GetUserPosts, GetUserPostsVariables> query={getUserPosts} variables={{ authorId: user.id }}>
                                                            {({ loading, error, data }) => {
                                                                if (error) {
                                                                    return <div>{error.message}</div>
                                                                }
                                                                if (loading) {
                                                                    return <div>Loading...</div>
                                                                }
                                                                return data ? (
                                                                    data.jotts_post.map(p => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                                                        <Link {...getEditPostUrl(user.handle, p.id)} key={p.id} passHref>
                                                                            <ListItem
                                                                                button
                                                                                component="a"
                                                                                selected={this.props.postId && this.props.postId === p.id ? true : false}
                                                                            >
                                                                                <ListItemIcon><NoteIcon /></ListItemIcon>
                                                                                <ListItemText inset primary={p.title} />
                                                                                <ListItemSecondaryAction>
                                                                                    <IconButton onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        this.deletePost(p.id, user)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton>
                                                                                </ListItemSecondaryAction>
                                                                            </ListItem>
                                                                        </Link>
                                                                    ))
                                                                ) : null
                                                            }}
                                                        </Query>
                                                    )
                                                    :
                                                    (
                                                        <Query<GetCollectionPosts, GetCollectionPostsVariables> query={getCollectionPosts} variables={{ collectionId: this.props.collectionId }}>
                                                            {({ loading, error, data }) => {
                                                                if (error) {
                                                                    return <div>{error.message}</div>
                                                                }
                                                                if (loading) {
                                                                    return <div>Loading...</div>
                                                                }
                                                                return data ? (
                                                                    data.jotts_collection_post.map(({ post: p }) => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                                                        <Link {...getEditPostUrl(user.handle, p.id)} key={p.id} passHref>
                                                                            <ListItem
                                                                                button
                                                                                component="a"
                                                                                selected={this.props.postId && this.props.postId === p.id ? true : false}
                                                                            >
                                                                                <ListItemIcon><NoteIcon /></ListItemIcon>
                                                                                <ListItemText inset primary={p.title} />
                                                                                <ListItemSecondaryAction>
                                                                                    <IconButton onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        this.deletePost(p.id, user)
                                                                                    }}>
                                                                                        <DeleteIcon />
                                                                                    </IconButton>
                                                                                </ListItemSecondaryAction>
                                                                            </ListItem>
                                                                        </Link>
                                                                    ))
                                                                ) : null
                                                            }}
                                                        </Query>
                                                    )
                                            }
                                        </List>
                                        <ListItem button component="a" onClick={() => this.createNewPost(user)}>
                                            <ListItemIcon><NoteAddIcon /></ListItemIcon>
                                            <ListItemText primary={"Add"} />
                                        </ListItem>
                                    </List>
                                ) : null
                        }
                        {
                            this.props.postId ?
                                (
                                    <div style={{ width: 900 }}>
                                        <EditPost postId={this.props.postId} />
                                    </div>
                                ) :
                                null
                        }
                    </div>
                </div>
            </Layout >
        )
    }

    createNewCollection(user: CookieUser) {
        const { client } = this.props;
        const id = uuidv4();
        const title = 'untitled';
        const slug = generateSlug(title, id);
        const variables = { authorId: user.id }
        client.mutate<NewCollectionMutation, NewCollectionMutationVariables>({
            mutation: newCollectionMutation,
            variables: { authorId: user.id, id, title, slug }
        }).then(res => {
            const data = client.readQuery<GetUserCollections, GetUserCollectionsVariables>({ query: getUserCollections, variables });
            const newCollection: GetUserCollections_jotts_collection = { __typename: 'jotts_collection', id, slug, title }
            const newData: GetUserCollections = { jotts_collection: data ? [...data.jotts_collection, newCollection] : [newCollection] }
            client.writeQuery<GetUserCollections, GetUserCollectionsVariables>({ query: getUserCollections, variables, data: newData })
        })
    }

    deleteCollection(id: string, user: CookieUser) {
        const { client } = this.props;
        const variables = { authorId: user.id }
        client.mutate<DeleteCollectionMutation, DeleteCollectionMutationVariables>({
            mutation: deleteCollectionMutation,
            variables: { id }
        }).then(res => {
            const data = client.readQuery<GetUserCollections, GetUserCollectionsVariables>({ query: getUserCollections, variables });
            const newData: GetUserCollections = { jotts_collection: data ? data.jotts_collection.filter(c => c.id !== id) : [] }
            client.writeQuery<GetUserCollections, GetUserCollectionsVariables>({ query: getUserCollections, variables, data: newData })
        })
    }

    updateCachePostsOfAll(user: CookieUser, callback: (oldData: GetUserPosts | null) => GetUserPosts) {
        const { client } = this.props
        const variables = { authorId: user.id }
        const oldData = client.readQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables })
        client.writeQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables, data: callback(oldData) })
    }

    updateCachePostsOfCollection(collectionId: string, callback: (oldData: GetCollectionPosts | null) => GetCollectionPosts) {
        const { client } = this.props
        const variables = { collectionId }
        const oldData = client.readQuery<GetCollectionPosts, GetCollectionPostsVariables>({ query: getCollectionPosts, variables })
        client.writeQuery<GetCollectionPosts, GetCollectionPostsVariables>({ query: getCollectionPosts, variables, data: callback(oldData) })
    }

    createNewPost(user: CookieUser) {
        const { collectionId } = this.props
        const { client } = this.props
        const id = uuidv4();
        const title = 'untitled';
        const slug = generateSlug(title, id);
        const content = serializeValue(DEFAULT_VALUE);


        const variables: NewPostVariables = {
            newPost: {
                author_id: user.id,
                id,
                title,
                slug,
                content,
                collection_posts: {
                    data: collectionId !== 'all' ? [{
                        collection_id: collectionId
                    }] : []
                }
            }
        }

        client.mutate<NewPost, NewPostVariables>({
            mutation: newPostMutation,
            variables
        }).then(res => {
            if (collectionId && collectionId !== 'all') {
                this.updateCachePostsOfCollection(collectionId, (oldData) => {
                    const newPost: GetCollectionPosts_jotts_collection_post = { __typename: 'jotts_collection_post', collection_id: collectionId, post: { __typename: 'jotts_post', id, title } };
                    return { jotts_collection_post: oldData ? [...oldData.jotts_collection_post, newPost] : [newPost] }
                })
            }
            this.updateCachePostsOfAll(user, (oldData) => {
                const newPost: GetUserPosts_jotts_post = { __typename: 'jotts_post', content, id, post_tags: [], slug, title }
                return { jotts_post: oldData ? [...oldData.jotts_post, newPost] : [newPost] }
            })
            Router.push(`/dashboard?handle=${user.handle}&collection_id=${collectionId}&post_id=${id}`)
        }).catch(e => console.log(e));
    }

    deletePost(postId: string, user: CookieUser) {
        const { collectionId } = this.props
        const { client } = this.props
        client.mutate<DeletePost, DeletePostVariables>({
            mutation: deletePostMutation,
            variables: { postId }
        }).then(res => {
            if (collectionId && collectionId !== 'all') {
                this.updateCachePostsOfCollection(collectionId, (oldData) => {
                    return { jotts_collection_post: oldData ? oldData.jotts_collection_post.filter(p => p.post.id !== postId) : [] }
                })
            }
            this.updateCachePostsOfAll(user, (oldData) => ({ jotts_post: oldData ? oldData.jotts_post.filter(p => p.id !== postId) : [] }))
        })
    }
}

export default withApollo(withStyles(styles)(DashBoard))
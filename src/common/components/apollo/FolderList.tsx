import { ApolloClient, gql } from 'apollo-boost';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { Mutation, Query } from 'react-apollo';
import uuidv4 from 'uuid/v4';

import {
  Collapse, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText,
  MenuItem
} from '@material-ui/core';
import { CreateNewFolder, Delete, Note } from '@material-ui/icons';

import {
  DeleteFolderMutation, DeleteFolderMutationVariables
} from '../../apollo-types/DeleteFolderMutation';
import { DeletePost, DeletePostVariables } from '../../apollo-types/DeletePost';
import {
  EditFolderMutation, EditFolderMutationVariables
} from '../../apollo-types/EditFolderMutation';
import {
  GetFolderPosts, GetFolderPosts_jotts_post, GetFolderPostsVariables
} from '../../apollo-types/GetFolderPosts';
import {
  GetSubFolders, GetSubFolders_jotts_folder, GetSubFoldersVariables
} from '../../apollo-types/GetSubFolders';
import {
  GetUserPosts, GetUserPosts_jotts_post, GetUserPostsVariables
} from '../../apollo-types/GetUserPosts';
import {
  NewFolderMutation, NewFolderMutationVariables
} from '../../apollo-types/NewFolderMutation';
import { NewPost, NewPostVariables } from '../../apollo-types/NewPost';
import { CookieUser } from '../../types';
import { loggedInUser } from '../../utils/loginStateProvider';
import EditableListItem from '../EditableListItem';
import { serializeValue } from '../JottsEditor';
import { DEFAULT_VALUE, generateSlug } from './EditPost';

const getFolderUrl = (handle: string, folderId: string) =>
    ({ href: `/dashboard?handle=${handle}&folder_id=${folderId}`, as: `/${handle}/dashboard/?folder_id=${folderId}` })
const getEditPostUrl = (handle: string, folderId: string, postId: string) =>
    ({ href: `/dashboard?handle=${handle}&folder_id=${folderId}&post_id=${postId}`, as: `/${handle}/dashboard/?folder_id=${folderId}&post_id=${postId}` });


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

const getSubFolders = gql`
query GetSubFolders($parentCondition: uuid_comparison_exp, $authorId: uuid!){
    jotts_folder(where:{parent_id: $parentCondition, author_id: {_eq: $authorId}}) {
        id
        slug
        title
        parent_id
    }
}
`

const getFolderPosts = gql`
query GetFolderPosts($folderId: uuid!){
    jotts_post(where:{folder_id:{_eq:$folderId}}) {
        id
        folder_id
        title
    }
}
`
const editFolderMutation = gql`
mutation EditFolderMutation($id:uuid!, $title: String!, $slug: String!){
    update_jotts_folder(where: {id:{_eq: $id}}, _set:{title:$title, slug:$slug}) {
        affected_rows
        returning {
            id
            title
            slug
        }
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

const deleteFolderMutation = gql`
mutation DeleteFolderMutation($id: uuid!){
    delete_jotts_folder(where: {id: {_eq: $id}}) {
        affected_rows
        returning {
            id
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

interface Props {
    folderId: string | null,
    postId: string | undefined
    client: ApolloClient<any>
    user: CookieUser
}

interface FolderListProps extends Props {
    padding: number
}

class FolderList extends React.Component<FolderListProps, State> {
    constructor(props: FolderListProps) {
        super(props)
        this.state = { expanded: {} }
    }
    render() {
        const { folderId, postId, user, client } = this.props
        return (
            <List component="nav" style={{ paddingLeft: this.props.padding }}>
                <Query<GetSubFolders, GetSubFoldersVariables>
                    query={getSubFolders}
                    variables={{ parentCondition: folderId === null ? { _is_null: true } : { _eq: folderId }, authorId: user.id }}

                >
                    {({ data, loading, error }) => {
                        if (error) {
                            return <div>{error.message}</div>
                        }
                        if (loading) {
                            return <div>Loading...</div>
                        }
                        return data ?
                            data.jotts_folder.map(c => (
                                <div key={c.id}>
                                    <Mutation<EditFolderMutation, EditFolderMutationVariables> mutation={editFolderMutation}>
                                        {(editFolder) => (
                                            <EditableListItem
                                                initialValue={c.title}
                                                onChange={async (value) => {
                                                    await editFolder({ variables: { id: c.id, slug: generateSlug(value, c.id), title: value } })
                                                }}
                                                listItemProps={{
                                                    selected: Boolean(this.state.expanded[c.id]),
                                                    onClick: () => {
                                                        this.setState({ expanded: { ...this.state.expanded, [c.id]: !Boolean(this.state.expanded[c.id]) } })
                                                        Router.push(getFolderUrl(user.handle, c.id).href, getFolderUrl(user.handle, c.id).as)
                                                    },
                                                    draggable: true,
                                                }}
                                                actions={(
                                                    [<MenuItem onClick={() => createNewPost(client, c.id)} key={"add-notes"}>Add Notes</MenuItem>,
                                                    <MenuItem onClick={() => createNewFolder(client, c.id)} key={"add-folder"}>Add Folder</MenuItem>,
                                                    <MenuItem onClick={() => deleteFolder(c.id, folderId, client)} key={"delete"}>Delete</MenuItem>,]
                                                )}
                                            />
                                        )}
                                    </Mutation>
                                    <Collapse in={this.state.expanded[c.id]} style={{ borderLeft: '1px solid red' }}>
                                        {
                                            this.state.expanded[c.id] ?
                                                (<FolderList folderId={c.id} postId={postId} user={user} client={client} padding={4} />) : null
                                        }
                                    </Collapse>
                                </div>
                            )) : null
                    }}
                </Query>
                {
                    folderId === null ?
                        (
                            <ListItem button component="a" onClick={() => createNewFolder(client, folderId)}>
                                <ListItemIcon><CreateNewFolder /></ListItemIcon>
                                <ListItemText primary={"Add"} />
                            </ListItem>
                        ) : (
                            <Query<GetFolderPosts, GetFolderPostsVariables> query={getFolderPosts} variables={{ folderId }}>
                                {({ loading, error, data }) => {
                                    if (error) {
                                        return <div>{error.message}</div>
                                    }
                                    if (loading) {
                                        return <div>Loading...</div>
                                    }
                                    return data ? (
                                        data.jotts_post.map(p => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                            <Link {...getEditPostUrl(user.handle, folderId, p.id)} key={p.id} passHref>
                                                <ListItem
                                                    button
                                                    component="a"
                                                    selected={this.props.postId && this.props.postId === p.id ? true : false}
                                                >
                                                    <ListItemIcon><Note /></ListItemIcon>
                                                    <ListItemText inset primary={p.title} />
                                                    <ListItemSecondaryAction>
                                                        <IconButton onClick={(e) => {
                                                            e.preventDefault();
                                                            deletePost(p.id, folderId, client);
                                                            this.forceUpdate()
                                                        }}>
                                                            <Delete />
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
        )
    }
}

const newFolderMutation = gql`
mutation NewFolderMutation($title:String!, $slug:String!, $authorId: uuid!, $id: uuid!, $parentId: uuid){
    insert_jotts_folder(objects: [{title: $title, slug:$slug, author_id:$authorId, id:$id, parent_id: $parentId}]) {
        affected_rows
        returning {
            id
        }
    }
}
`

function createNewFolder(client: ApolloClient<any>, parentId: string | null) {
    const user = loggedInUser();
    if (!user) {
        return
    }
    const id = uuidv4();
    const title = 'untitled';
    const slug = generateSlug(title, id);
    const variables = { authorId: user.id, parentCondition: parentId === null ? { _is_null: true } : { _eq: parentId } }
    client.mutate<NewFolderMutation, NewFolderMutationVariables>({
        mutation: newFolderMutation,
        variables: { authorId: user.id, id, title, slug, parentId }
    }).then(res => {
        try {
            const data = client.readQuery<GetSubFolders, GetSubFoldersVariables>({ query: getSubFolders, variables });
            const newFolder: GetSubFolders_jotts_folder = { __typename: 'jotts_folder', id, slug, title, parent_id: parentId }
            const newData: GetSubFolders = { jotts_folder: data ? [...data.jotts_folder, newFolder] : [newFolder] }
            client.writeQuery<GetSubFolders, GetSubFoldersVariables>({ query: getSubFolders, variables, data: newData })
        } catch (error) {

        }
        Router.push(getFolderUrl(user.handle, id).href, getFolderUrl(user.handle, id).as)
    })
}

function deleteFolder(id: string, parentId: string | null, client: ApolloClient<any>) {
    const user = loggedInUser();
    if (!user) {
        return
    }
    const variables = { authorId: user.id, parentCondition: parentId === null ? { _is_null: true } : { _eq: parentId } }
    client.mutate<DeleteFolderMutation, DeleteFolderMutationVariables>({
        mutation: deleteFolderMutation,
        variables: { id }
    }).then(res => {
        try {
            const data = client.readQuery<GetSubFolders, GetSubFoldersVariables>({ query: getSubFolders, variables });
            const newData: GetSubFolders = { jotts_folder: data ? data.jotts_folder.filter(f => f.id !== id) : [] }
            client.writeQuery<GetSubFolders, GetSubFoldersVariables>({ query: getSubFolders, variables, data: newData })
        } catch (error) {

        }
    })
}

function updateCachePostsOfAll(user: CookieUser, client: ApolloClient<any>, callback: (oldData: GetUserPosts | null) => GetUserPosts) {
    const variables = { authorId: user.id }
    try {
        const oldData = client.readQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables })
        client.writeQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables, data: callback(oldData) })
    } catch (error) {

    }
}

function updateCachePostsOfFolder(folderId: string, client: ApolloClient<any>, callback: (oldData: GetFolderPosts | null) => GetFolderPosts) {
    const variables = { folderId }
    try {
        const oldData = client.readQuery<GetFolderPosts, GetFolderPostsVariables>({ query: getFolderPosts, variables })
        client.writeQuery<GetFolderPosts, GetFolderPostsVariables>({ query: getFolderPosts, variables, data: callback(oldData) })
    } catch (error) {

    }
}

function createNewPost(client: ApolloClient<any>, folderId: string) {
    const user = loggedInUser();
    if (!user) {
        return
    }
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
            folder_id: folderId
        }
    }

    return client.mutate<NewPost, NewPostVariables>({
        mutation: newPostMutation,
        variables
    }).then(res => {
        updateCachePostsOfFolder(folderId, client, (oldData) => {
            const newPost: GetFolderPosts_jotts_post = { __typename: 'jotts_post', folder_id: folderId, id, title };
            return { jotts_post: oldData ? [...oldData.jotts_post, newPost] : [newPost] }
        })
        updateCachePostsOfAll(user, client, (oldData) => {
            const newPost: GetUserPosts_jotts_post = { __typename: 'jotts_post', content, id, post_tags: [], slug, title }
            return { jotts_post: oldData ? [...oldData.jotts_post, newPost] : [newPost] }
        })
        Router.push(getEditPostUrl(user.handle, folderId!, id).href, getEditPostUrl(user.handle, folderId!, id).as)
    }).catch(e => console.log(e));
}

function deletePost(postId: string, folderId: string, client: ApolloClient<any>) {
    const user = loggedInUser();
    if (!user) {
        return
    }
    client.mutate<DeletePost, DeletePostVariables>({
        mutation: deletePostMutation,
        variables: { postId }
    }).then(res => {
        updateCachePostsOfFolder(folderId, client, (oldData) => {
            return { jotts_post: oldData ? oldData.jotts_post.filter(p => p.id !== postId) : [] }
        })
        updateCachePostsOfAll(user, client, (oldData) => ({ jotts_post: oldData ? oldData.jotts_post.filter(p => p.id !== postId) : [] }))
    })
}

interface State {
    expanded: { [key: string]: boolean }
}

export default FolderList
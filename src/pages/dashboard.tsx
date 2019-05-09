import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import { GetInitialProps, NextContext } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { ApolloConsumer, Query } from 'react-apollo';
import uuidv4 from 'uuid/v4';

import {
  createStyles, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText,
  Theme, withStyles, WithStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import NotesIcon from '@material-ui/icons/Notes';

import { DeletePost, DeletePostVariables } from '../common/apollo-types/DeletePost';
import {
  GetUserPosts, GetUserPosts_jotts_post, GetUserPostsVariables
} from '../common/apollo-types/GetUserPosts';
import { NewPost, NewPostVariables } from '../common/apollo-types/NewPost';
import EditPost, {
  DEFAULT_VALUE, generateSlug, getEditPostUrl
} from '../common/components/apollo/EditPost';
import { serializeValue } from '../common/components/JottsEditor';
import Layout from '../common/components/Layout';
import PostCard from '../common/components/PostCard';
import { loggedInUser } from '../common/utils/loginStateProvider';

export const getUserPosts = gql`
query GetUserPosts($authorId: uuid!, $skip: Int!, $size: Int!) {
    jotts_post(where: {author_id:{_eq:$authorId}}, limit: $size, offset: $skip) {
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

const styles = (theme: Theme) => createStyles({
    addButton: {
        position: 'absolute',
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4
    }
});

type StyleProps = WithStyles<typeof styles>

type Props = StyleProps & InitialProps;

interface InitialProps {
    postId: string | undefined
}

const getInitialProps: GetInitialProps<InitialProps, NextContext> = context => {
    const id = context.query['post_id'];
    const postId = id instanceof Array ? (id.length > 0 ? id[0] : undefined) : id;
    return { postId }
}

class DashBoard extends React.Component<Props> {
    public static getInitialProps = getInitialProps
    render() {
        const user = loggedInUser();
        if (!user) {
            return null;
        }
        const { classes } = this.props;
        const variables: GetUserPostsVariables = { authorId: user.id, size: 100, skip: 0 }
        return (
            <Layout>
                <div>
                    <ApolloConsumer>
                        {client => (
                            <Query<GetUserPosts, GetUserPostsVariables> query={getUserPosts} variables={variables}>
                                {({ loading, error, data }) => {
                                    if (error) {
                                        return <div>{error.message}</div>
                                    }
                                    if (loading) {
                                        return <div>Loading...</div>
                                    }
                                    return data ? (
                                        <div style={{ display: 'flex' }}>
                                            <List component="nav">
                                                {
                                                    data.jotts_post.map(p => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                                        <Link {...getEditPostUrl(user.handle, p.id)} key={p.id} passHref>
                                                            <ListItem button component="a" selected={this.props.postId && this.props.postId === p.id ? true : false}>
                                                                <ListItemIcon><NotesIcon /></ListItemIcon>
                                                                <ListItemText primary={p.title} />
                                                                <ListItemSecondaryAction>
                                                                    <IconButton onClick={(e) => {
                                                                        e.preventDefault();
                                                                        this.deletePost(client, p.id, variables)
                                                                    }}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </ListItemSecondaryAction>
                                                            </ListItem>
                                                        </Link>
                                                    ))
                                                }
                                                <ListItem button component="a" onClick={() => this.createNewPost(client, variables)}>
                                                    <ListItemIcon><AddIcon /></ListItemIcon>
                                                    <ListItemText primary={"Add"} />
                                                </ListItem>
                                            </List>
                                            {
                                                this.props.postId ?
                                                    (
                                                        <div style={{ width: 900 }}>
                                                            <EditPost postId={this.props.postId} />
                                                        </div>
                                                    ) :
                                                    (
                                                        <div style={{
                                                            flex: 1,
                                                            display: "flex",
                                                            flexWrap: "wrap",
                                                            justifyContent: "space-evenly"
                                                        }}>
                                                            {
                                                                data.jotts_post.map(p => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                                                    <PostCard key={p.id} data={p} />
                                                                ))
                                                            }
                                                        </div>
                                                    )
                                            }
                                        </div>
                                    ) : null
                                }}
                            </Query>
                        )}
                    </ApolloConsumer>
                </div>
            </Layout>
        )
    }

    createNewPost(client: ApolloClient<any>, variables: GetUserPostsVariables) {
        const DEFAULT_TITLE = 'untitled';

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
                const allPosts = client.cache.readQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables })
                if (allPosts && allPosts.jotts_post.length >= variables.size) {
                    allPosts.jotts_post.shift()
                }
                const newPost: GetUserPosts_jotts_post = { __typename: 'jotts_post', content, id, post_tags: [], slug, title }
                const data: GetUserPosts = { jotts_post: allPosts ? [...allPosts.jotts_post, newPost] : [newPost] }
                client.cache.writeQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables, data })
                const { href, as } = getEditPostUrl(user.handle, id);
                Router.replace(href, as)
            })
                .catch(e => console.log(e));
        }
    }
    deletePost(client: ApolloClient<any>, postId: string, variables: GetUserPostsVariables) {
        client.mutate<DeletePost, DeletePostVariables>({
            mutation: deletePostMutation,
            variables: { postId }
        }).then(res => {
            const allPosts = client.cache.readQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables })
            const data: GetUserPosts = { jotts_post: allPosts ? allPosts.jotts_post.filter(p => p.id !== postId) : [] }
            client.cache.writeQuery<GetUserPosts, GetUserPostsVariables>({ query: getUserPosts, variables, data })
            this.forceUpdate()
        })
    }
}

export default withStyles(styles)(DashBoard)
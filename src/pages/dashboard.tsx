import gql from 'graphql-tag';
import { GetInitialProps, NextContext } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { Query } from 'react-apollo';

import {
  createStyles, List, ListItem, ListItemIcon, ListItemText, Theme, withStyles, WithStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NotesIcon from '@material-ui/icons/Notes';

import { GetUserPosts, GetUserPostsVariables } from '../common/apollo-types/GetUserPosts';
import EditPost, { getEditPostUrl } from '../common/components/apollo/EditPost';
import Layout from '../common/components/Layout';
import PostCard from '../common/components/PostCard';
import { loggedInUser } from '../common/utils/loginStateProvider';

const getUserPosts = gql`
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
    postId: string | undefined,
    createNew: boolean
}

const getInitialProps: GetInitialProps<InitialProps, NextContext> = context => {
    const id = context.query['post_id'];
    const createNew = context.query['create_new'];
    console.log(context.query)
    const postId = id instanceof Array ? (id.length > 0 ? id[0] : undefined) : id;
    return { postId, createNew: createNew ? true : false }
}

class DashBoard extends React.Component<Props> {
    public static getInitialProps = getInitialProps
    render() {
        const user = loggedInUser();
        const { classes } = this.props
        return (
            <Layout>
                {user ?
                    (
                        <div>
                            <Query<GetUserPosts, GetUserPostsVariables> query={getUserPosts} variables={{ authorId: user.id, size: 20, skip: 0 }}>
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
                                                            <ListItem button component="a">
                                                                <ListItemIcon><NotesIcon /></ListItemIcon>
                                                                <ListItemText primary={p.title} />
                                                            </ListItem>
                                                        </Link>
                                                    ))
                                                }
                                                <Link href={`/dashboard?handle=${user.handle}&create_new=true`} passHref>
                                                    <ListItem button component="a">
                                                        <ListItemIcon><AddIcon /></ListItemIcon>
                                                        <ListItemText primary={"Add"} />
                                                    </ListItem>
                                                </Link>
                                            </List>
                                            {this.props.createNew ?
                                                (
                                                    <div style={{ width: 900, height: 500 }}>
                                                        <EditPost action={{ type: 'new' }} />
                                                    </div>
                                                ) :
                                                this.props.postId ?
                                                    (
                                                        <div style={{ width: 900, height: 500 }}>
                                                            <EditPost action={this.props.createNew ? { type: 'new' } : { type: 'edit', postId: this.props.postId }} />
                                                        </div>
                                                    ) :
                                                    (
                                                        <div>
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
                        </div>
                    )
                    :
                    null}
            </Layout>
        )
    }
}

export default withStyles(styles)(DashBoard)
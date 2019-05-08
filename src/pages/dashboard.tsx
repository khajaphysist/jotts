import gql from 'graphql-tag';
import { GetInitialProps, NextContext } from 'next';
import Link from 'next/link';
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
    const postId = id instanceof Array ? (id.length > 0 ? id[0] : undefined) : id;
    return { postId, createNew: createNew ? true : false }
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
                                            <div style={{ width: 900 }}>
                                                <EditPost action={{ type: 'new' }} variables={variables} />
                                            </div>
                                        ) :
                                        this.props.postId ?
                                            (
                                                <div style={{ width: 900 }}>
                                                    {
                                                        this.props.createNew ?
                                                            (
                                                                <EditPost action={{ type: 'new' }} variables={variables} />
                                                            ) :
                                                            (
                                                                <EditPost action={{ type: 'edit', postId: this.props.postId }} variables={variables} />
                                                            )
                                                    }
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
                </div>
            </Layout>
        )
    }
}

export default withStyles(styles)(DashBoard)
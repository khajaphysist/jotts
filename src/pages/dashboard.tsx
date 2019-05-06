import { text } from 'body-parser';
import gql from 'graphql-tag';
import Link from 'next/link';
import { Query } from 'react-apollo';

import {
  createStyles, Drawer, Fab, ListItem, ListItemIcon, ListItemText, Theme, withStyles, WithStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NotesIcon from '@material-ui/icons/Notes';

import { GetUserPosts, GetUserPostsVariables } from '../common/apollo-types/GetUserPosts';
import Layout from '../common/components/Layout';
import PostCard from '../common/components/PostCard';
import { loggedInUser } from '../common/utils/loginStateProvider';

const styles = (theme: Theme) => createStyles({
    addButton: {
        position: 'absolute',
        bottom: theme.spacing.unit * 4,
        right: theme.spacing.unit * 4
    }
});

type StyleProps = WithStyles<typeof styles>

type Props = StyleProps;

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

function DashBoard(props: Props) {
    const user = loggedInUser();
    const { classes } = props
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
                                        <div>
                                            {
                                                data.jotts_post.map(p => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                                    <ListItem button key={p.id}>
                                                        <ListItemIcon><NotesIcon /></ListItemIcon>
                                                        <ListItemText primary={p.title} />
                                                    </ListItem>
                                                ))
                                            }
                                            <Link href="/edit" passHref>
                                                <ListItem button>
                                                    <ListItemIcon><AddIcon /></ListItemIcon>
                                                    <ListItemText primary={"Add"} />
                                                </ListItem>
                                            </Link>
                                        </div>
                                        {
                                            data.jotts_post.map(p => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                                <PostCard key={p.id} data={p} />
                                            ))
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

export default withStyles(styles)(DashBoard)
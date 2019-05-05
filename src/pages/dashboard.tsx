import gql from 'graphql-tag';
import Link from 'next/link';
import { Query } from 'react-apollo';

import { createStyles, Fab, Theme, withStyles, WithStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

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
                    <Query<GetUserPosts, GetUserPostsVariables> query={getUserPosts} variables={{ authorId: user.id, size: 20, skip: 0 }}>
                        {({ loading, error, data }) => {
                            if (error) {
                                return <div>{error.message}</div>
                            }
                            if (loading) {
                                return <div>Loading...</div>
                            }
                            return data ? (
                                data.jotts_post.map(p => ({ ...p, author: { name: user.name, handle: user.handle } })).map(p => (
                                    <PostCard key={p.id} data={p} />
                                ))
                            ) : null
                        }}
                    </Query>
                )
                :
                null}
            <Link href="/edit" passHref>
                    <Fab color="secondary" className={classes.addButton}>
                        <AddIcon />
                    </Fab>
            </Link>
        </Layout>
    )
}

export default withStyles(styles)(DashBoard)
import { ApolloClient } from 'apollo-boost';
import { GetInitialProps, NextContext } from 'next';
import React from 'react';
import { withApollo } from 'react-apollo';

import {
  createStyles, Divider, List, Theme, Typography, withStyles, WithStyles
} from '@material-ui/core';

import EditPost from '../common/components/apollo/EditPost';
import FolderList from '../common/components/apollo/FolderList';
import Layout from '../common/components/Layout';
import { loggedInUser } from '../common/utils/loginStateProvider';

const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        maxWidth: 1200
    },
    navBar: {
        width: 300,
        height: 800,
        overflowY: 'auto'
    },
    editor: {
        flex: 1,
        maxWidth: 900
    },
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
    folderId: string | undefined
}

const getQueryParm = (query: string | string[] | undefined) =>
    query instanceof Array ? (query.length > 0 ? query[0] : undefined) : query;

const getInitialProps: GetInitialProps<InitialProps, NextContext> = context => {
    const { post_id, folder_id } = context.query;
    const postId = getQueryParm(post_id);
    const folderId = getQueryParm(folder_id);
    return { postId, folderId }
}

class DashBoard extends React.Component<Props> {
    public static getInitialProps = getInitialProps
    render() {
        const user = process.browser ? loggedInUser() : undefined;
        if (!user) {
            return null;
        }
        const { postId, client, folderId, classes } = this.props;
        return (
            <Layout>
                <div className={classes.root}>
                    <List component="nav" className={classes.navBar} disablePadding>
                        <Typography variant='h5' color="textSecondary" style={{ padding: 16, paddingTop: 28, paddingBottom: 4 }}>Folders</Typography>
                        <Divider />
                        <FolderList
                            folderId={null}
                            postId={postId}
                            user={user}
                            client={client}
                            padding={0}
                            selectedFolders={folderId ? folderId.split(',') : []}
                        />
                    </List>
                    {
                        postId ?
                            (
                                <div className={classes.editor}>
                                    <EditPost postId={postId} />
                                </div>
                            ) :
                            null
                    }
                </div>
            </Layout >
        )
    }

}

export default withApollo(withStyles(styles)(DashBoard))
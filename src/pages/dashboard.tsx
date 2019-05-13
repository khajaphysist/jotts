import { ApolloClient } from 'apollo-boost';
import { GetInitialProps, NextContext } from 'next';
import React from 'react';
import { withApollo } from 'react-apollo';

import { createStyles, Divider, List, Theme, withStyles, WithStyles } from '@material-ui/core';

import EditPost from '../common/components/apollo/EditPost';
import FolderList from '../common/components/apollo/FolderList';
import Layout from '../common/components/Layout';
import { loggedInUser } from '../common/utils/loginStateProvider';

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
        const { postId, client } = this.props;
        return (
            <Layout>
                <div style={{ display: 'flex' }}>
                    <List component="nav" style={{ width: 300, height: 500 }}>
                        <Divider />
                        <FolderList folderId={null} postId={postId} user={user} client={client} padding={0} />
                    </List>
                    {
                        this.props.postId ?
                            (
                                <div >
                                    <EditPost postId={this.props.postId} />
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
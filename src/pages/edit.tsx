import React from 'react';

import EditPostComponent from '../common/components/apollo/EditPost';
import Layout from '../common/components/Layout';

class EditPost extends React.Component {
    render() {
        return (
            <Layout>
                <EditPostComponent />
            </Layout>
        )
    }
}

export default EditPost;
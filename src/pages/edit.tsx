import dynamic from 'next/dynamic';
import React from 'react';

import Layout from '../common/components/Layout';

const JottsEditor = dynamic(() => import('../common/components/JottsEditor'), { ssr: false })


class EditPost extends React.Component {
    render() {
        return (
            <Layout>
                <div style={{ maxWidth: 1200, minWidth: 900 }}>
                    <JottsEditor />
                </div>
            </Layout>
        )
    }
}

export default EditPost;
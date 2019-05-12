import gql from 'graphql-tag';
import { NextContext } from 'next';
import React from 'react';
import { Query } from 'react-apollo';

import { GetPostSummary, GetPostSummaryVariables } from '../common/apollo-types/GetPostSummary';
import JottsEditor, { deserializeValue } from '../common/components/JottsEditor';
import Layout from '../common/components/Layout';

const getPostSummary = gql`
query GetPostSummary($slug: String!) {
    jotts_post(where:{slug: {_eq: $slug}}) {
        id
        title
        author {
            id
            name
            handle
            profile_picture
        }
        slug
        post_tags {
            tag
        }
        content
    }
}
`;

interface InitialProps {
    slug: string
}

interface Props extends InitialProps { }

class Post extends React.Component<Props> {
    public static getInitialProps = async (context: NextContext<{ slug: string }>) => {
        const { slug } = context.query
        return { slug }
    }
    public render = () =>
        (
            <Layout>
                <Query<GetPostSummary, GetPostSummaryVariables> query={getPostSummary} variables={{ slug: this.props.slug }}>
                    {
                        ({ loading, error, data }) => {
                            if (error) {
                                console.log(JSON.stringify(error))
                                return <div>{error.message}</div>
                            }
                            if (loading) {
                                console.log(data)
                                return <div>Loading...</div>
                            }
                            if (data && data.jotts_post.length > 0) {
                                const postData = data.jotts_post[0];
                                return (
                                    <div style={{width: 900}}>
                                        <p>Title: {postData.title}</p>
                                        <p>Author: {postData.author.name}, @{postData.author.handle},</p>
                                        {
                                            postData.content ?
                                                (<JottsEditor value={deserializeValue(postData.content)} readOnly />) : null
                                        }
                                        <p>Tags: {postData.post_tags.map(t => t.tag).join(", ")}</p>
                                    </div>
                                )
                            }
                        }
                    }
                </Query>
            </Layout>
        )

}

export default Post
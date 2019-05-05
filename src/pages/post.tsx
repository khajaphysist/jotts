import gql from 'graphql-tag';
import { NextContext } from 'next';
import React from 'react';
import { Query } from 'react-apollo';

import { GetPost, GetPostVariables } from '../common/apollo-types/GetPost';
import Layout from '../common/components/Layout';

const getPost = gql`
query GetPost($slug: String!) {
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
                <Query<GetPost, GetPostVariables> query={getPost} variables={{ slug: this.props.slug }}>
                    {
                        ({ loading, error, data }) => {
                            if (error) {
                                return <div>{error.message}</div>
                            }
                            if (loading) {
                                return <div>Loading...</div>
                            }
                            if (data && data.jotts_post.length > 0) {
                                const postData = data.jotts_post[0];
                                return (
                                    <div>
                                        <p>Title: {postData.title}</p>
                                        <p>Author: {postData.author.name}, @{postData.author.handle},</p>
                                        <p>Content: {postData.content}</p>
                                        <p>Tags: {postData.post_tags.map(t=>t.tag).join(", ")}</p>
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
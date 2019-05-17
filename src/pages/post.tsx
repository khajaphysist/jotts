import gql from 'graphql-tag';
import { NextContext } from 'next';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';

import {
  Chip, createStyles, Theme, Typography, withStyles, WithStyles
} from '@material-ui/core';

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

const styles = (theme: Theme) => createStyles({
    root: {
        minWidth: 900,
        maxWidth: 1200,
        display: "flex",
        flexDirection: "column",
    },
    title: {

    },
    author: {

    },
    content: {
    },
    tagsContainer: {
        marginTop: 2 * theme.spacing.unit
    },
    tag: {
        margin: theme.spacing.unit
    }
})

type StyleProps = WithStyles<typeof styles>

interface InitialProps {
    slug: string
}

type Props = InitialProps & StyleProps;

class Post extends React.Component<Props> {
    public static getInitialProps = async (context: NextContext<{ slug: string }>) => {
        const { slug } = context.query
        return { slug }
    }
    public render() {
        const { classes } = this.props
        return (
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
                                    <div className={classes.root}>
                                        <Typography variant='h2' component="h1" className={classes.title}>{postData.title}</Typography>
                                        <div className={classes.author}>
                                            <p>Author: {postData.author.name}, @{postData.author.handle},</p>
                                        </div>
                                        {
                                            postData.content ?
                                                (
                                                    <div className={classes.content}>
                                                        <JottsEditor value={deserializeValue(postData.content)} readOnly />
                                                    </div>
                                                ) : null
                                        }
                                        <div className={classes.tagsContainer}>
                                            {postData.post_tags.map(t => (
                                                <Link href={`/?tags=${t.tag}`} passHref>
                                                    <Chip label={t.tag} className={classes.tag} component={'a' as any} />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }
                        }
                    }
                </Query>
            </Layout>
        )
    }

}

export default withStyles(styles)(Post)
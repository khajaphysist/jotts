import gql from 'graphql-tag';
import { NextContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';

import {
  Avatar, Chip, createStyles, Theme, Typography, withStyles, WithStyles
} from '@material-ui/core';

import { GetPostSummary, GetPostSummaryVariables } from '../common/apollo-types/GetPostSummary';
import JottsEditor, { deserializeValue } from '../common/components/JottsEditor';
import Layout from '../common/components/Layout';
import { s3ImagePrefix } from '../common/vars';

const getPostSummary = gql`
query GetPostSummary($postId: uuid!) {
    jotts_post(where:{id: {_eq: $postId}}) {
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
        created_at
    }
}
`;

const styles = (theme: Theme) => createStyles({
    root: {
        minWidth: 900,
        maxWidth: "70%",
        display: "flex",
        flexDirection: "column",
    },
    title: {

    },
    author: {
        height: 64,
        display: "flex",
        alignItems: 'center',
        margin: `${theme.spacing.unit}px 0px`
    },
    authorName:{
        marginLeft: theme.spacing.unit
    },
    profilePicture:{
        
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
    postId: string
}

type Props = InitialProps & StyleProps;

class Post extends React.Component<Props> {
    public static getInitialProps = async (context: NextContext<{ slug: string }>) => {
        return { postId: context.query.slug.substr(-36) }
    }
    public render() {
        const { classes } = this.props
        return (
            <Layout>
                <Query<GetPostSummary, GetPostSummaryVariables> query={getPostSummary} variables={{ postId: this.props.postId }}>
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
                                        <Head><title>{postData.title}</title></Head>
                                        <Typography variant='h3' component="h1" className={classes.title}>{postData.title}</Typography>
                                        <div className={classes.author}>
                                            <Avatar src={`${s3ImagePrefix}/${postData.author.profile_picture}`} className={this.props.classes.profilePicture} />
                                            <div className={this.props.classes.authorName}>
                                                <Typography color="secondary" >
                                                    {postData.author.handle}
                                                </Typography>
                                                <Typography color="textSecondary" variant="caption">
                                                    {(new Date(postData.created_at)).toDateString().substr(4)}
                                                </Typography>
                                            </div>
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
                                                <Link href={`/?tags=${t.tag}`} passHref key={t.tag}>
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
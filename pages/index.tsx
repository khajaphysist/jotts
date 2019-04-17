import gql from 'graphql-tag';
import Pagination from 'material-ui-flat-pagination';
import { GetInitialProps, NextContext } from 'next';
import Router from 'next/router';
import React from 'react';
import { Query } from 'react-apollo';

import {
  Card, Chip, createStyles, Divider, Theme, Typography, WithStyles, withStyles
} from '@material-ui/core';

import Layout from '../components/Layout';
import { GetPosts, GetPostsVariables } from '../types/GetPosts';

export const getPosts = gql`
query GetPosts($skip: Int!, $size: Int!) {
  jotts_post(limit: $size, offset: $skip) {
    author {
      id
      handle
      name
    }
    id
    title
    content
    tags {
      tag
    }
  }
  jotts_post_aggregate {
    aggregate {
      count
    }
  }
}
`

const styles = (theme: Theme) => createStyles({
  outer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  item: {
    width: "300px",
    padding: 2 * theme.spacing.unit,
    margin: theme.spacing.unit,
    display: "flex",
    flexDirection: "column"
  },
  itemTitle: {
    flexBasis: "20%"
  },
  itemAuthor: {
    flexBasis: "10%",
    display: "flex",
  },
  itemAuthorName: {
    flex: 1
  },
  itemAuthorHandle: {
    flex: 1
  },
  itemContent: {
    flexBasis: "50%"
  },
  itemTags: {
    flexBasis: "10%"
  },
  itemActions: {
    flexBasis: "10%"
  },
  pagination: {
    display: "flex",
    justifyContent: "center"
  }
})

type StyleProps = WithStyles<typeof styles>;
interface InitialProps {
  page: number,
  size: number
}

type Props = StyleProps & InitialProps

const defaultPageSize = 20;

const getInitialProps: GetInitialProps<InitialProps, NextContext> = async (context) => {
  const p = context.query['page'] as string;
  const s = context.query['size'] as string;
  const page = p ? parseInt(p, 10) : 1;
  const size = s ? parseInt(s, 10) : defaultPageSize;
  return {
    page,
    size
  }
}

class Index extends React.Component<Props> {
  public static getInitialProps = getInitialProps;

  public render() {
    return (
      <Layout>
        <div>
          <Query<GetPosts, GetPostsVariables> query={getPosts} variables={{ size: this.props.size, skip: (this.props.page-1) * this.props.size }}>
            {({ loading, error, data }) => {
              if (error) {
                return <div>{error.message}</div>
              }
              if (loading) {
                return <div>Loading...</div>
              }
              return data ? (
                <div>
                  <div className={this.props.classes.outer}>
                    {data.jotts_post.map(e => (
                      <Card className={this.props.classes.item} key={e.id}>
                        <Typography variant="h6" className={this.props.classes.itemTitle}>
                          {e.title}
                        </Typography>
                        <div className={this.props.classes.itemAuthor}>
                          <Typography color="secondary" className={this.props.classes.itemAuthorName}>
                            {e.author.name}
                          </Typography>
                          <Typography color="textSecondary" className={this.props.classes.itemAuthorHandle}>
                            @{e.author.handle}
                          </Typography>
                        </div>
                        <Divider />
                        <Typography variant="body1" className={this.props.classes.itemContent}>
                          {e.content}
                        </Typography>
                        <Divider />
                        <div className={this.props.classes.itemTags}>
                          Tags: {e.tags.map(tag => (
                            <Chip key={tag.tag} label={tag.tag} />
                          ))}
                        </div>
                        <div className={this.props.classes.itemActions}>
                          Actions
                    </div>
                      </Card>
                    ))}
                  </div>
                  <Pagination className={this.props.classes.pagination}
                    limit={defaultPageSize}
                    offset={(this.props.page-1)*defaultPageSize}
                    total={data.jotts_post_aggregate.aggregate && data.jotts_post_aggregate.aggregate.count !== null ?
                    data.jotts_post_aggregate.aggregate.count : 0}
                    onClick={(_e, offset, page)=>{
                      Router.push("/?page="+(page))
                    }}
                    size="large"
                    />
                </div>
              ) : null
            }}
          </Query>
        </div>
      </Layout>
    )
  }
}

export default withStyles(styles)(Index)
import gql from 'graphql-tag';
import Pagination from 'material-ui-flat-pagination';
import { GetInitialProps, NextContext } from 'next';
import Router from 'next/router';
import React from 'react';
import { Query } from 'react-apollo';

import { createStyles, NoSsr, Theme, WithStyles, withStyles } from '@material-ui/core';

import {
  GetPostsWithTags, GetPostsWithTagsVariables
} from '../common/apollo-types/GetPostsWithTags';
import SelectTags from '../common/components/apollo/SelectTags';
import Layout from '../common/components/Layout';
import PostCard from '../common/components/PostCard';

const getPostsWithTags = gql`
query GetPostsWithTags($skip: Int!, $size: Int!, $tags: String!) {
  jotts_post_by_tag(limit: $size, offset: $skip, args:{arg_1: $tags}) {
    author {
      id
      handle
      name
      profile_picture
    }
    id
    title
    summary
    slug
    post_tags {
      tag
    }
    created_at
  }
  jotts_post_by_tag_aggregate(args:{arg_1: $tags}) {
    aggregate {
      count
    }
  }
}
`

const styles = (theme: Theme) => createStyles({
  root: {
    flex: 1
  },
  selectTags: {

  },
  itemContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    margin: 2 * theme.spacing.unit
  },
  pagination: {
    display: "flex",
    justifyContent: "center"
  }
})

type StyleProps = WithStyles<typeof styles>;
interface InitialProps {
  page: number,
  size: number,
  tags: string[]
}

type Props = StyleProps & InitialProps

const defaultPageSize = 20;

const getInitialProps: GetInitialProps<InitialProps, NextContext<{ page: string, size: string, tags: string }>> = async (context) => {
  const { page, size, tags } = context.query
  return {
    page: page ? parseInt(page, 10) : 1,
    size: size ? parseInt(size, 10) : defaultPageSize,
    tags: tags ? tags.split(",") : []
  }
}

class Index extends React.Component<Props> {
  public static getInitialProps = getInitialProps;

  public render() {
    return (
      <Layout>
        <div className={this.props.classes.root}>

          <Query<GetPostsWithTags, GetPostsWithTagsVariables> query={getPostsWithTags} variables={{ size: this.props.size, skip: (this.props.page - 1) * this.props.size, tags: this.props.tags.join(',') }}>
            {({ loading, error, data }) => {
              if (error) {
                return <div>{error.message}</div>
              }
              if (loading) {
                return <div>Loading...</div>
              }
              return data ? (
                <div>
                  <div className={this.props.classes.selectTags}>
                    <NoSsr>
                      <SelectTags
                        onChange={(selected) => {
                          selected.length > 0 ? Router.push("/?tags=" + selected.join(",")) : Router.push("/")
                        }}
                        value={this.props.tags}
                      />
                    </NoSsr>
                  </div>
                  <div className={this.props.classes.itemContainer}>
                    {data.jotts_post_by_tag.map(e => (
                      <PostCard data={e} key={e.id} />
                    ))}
                  </div>
                  <Pagination className={this.props.classes.pagination}
                    limit={this.props.size}
                    offset={(this.props.page - 1) * this.props.size}
                    total={data.jotts_post_by_tag_aggregate.aggregate && data.jotts_post_by_tag_aggregate.aggregate.count ? data.jotts_post_by_tag_aggregate.aggregate.count : 0}
                    onClick={(_e, _offset, page) => {
                      const tagsQuery = this.props.tags.length > 0 ? "tags=" + this.props.tags.join(',') : undefined;
                      const pageQuery = page > 1 ? "page=" + page.toString() : undefined;
                      const queryString = tagsQuery || pageQuery ? "?" + [tagsQuery, pageQuery].filter(s => s).join('&') : '';
                      Router.push("/" + queryString)
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
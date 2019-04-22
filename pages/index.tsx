import { ApolloClient } from 'apollo-boost';
import gql from 'graphql-tag';
import { debounce } from 'lodash';
import Pagination from 'material-ui-flat-pagination';
import { GetInitialProps, NextContext } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import React from 'react';
import { ApolloConsumer, Query } from 'react-apollo';

import {
  Card, Chip, createStyles, Divider, NoSsr, Theme, Typography, WithStyles, withStyles
} from '@material-ui/core';

import Layout from '../components/Layout';
import MaterialReactSelect from '../components/MaterialReactSelect';
import { GetPostsWithTags, GetPostsWithTagsVariables } from '../types/GetPostsWithTags';
import { GetTagSuggestions, GetTagSuggestionsVariables } from '../types/GetTagSuggestions';

const getPostsWithTags = gql`
query GetPostsWithTags($skip: Int!, $size: Int!, $tags: String!) {
  jotts_post_by_tag(limit: $size, offset: $skip, args:{arg_1: $tags}) {
    author {
      id
      handle
      name
    }
    id
    title
    content
    slug
    tags {
      tag
    }
  }
  jotts_post_by_tag_aggregate(args:{arg_1: $tags}) {
    aggregate {
      count
    }
  }
  jotts_tag_post_count_view(limit:100, order_by:{post_count:desc_nulls_last}) {
    tag
    post_count
  }
}
`

const getTagSuggestions = gql`
query GetTagSuggestions($query: String!){
  jotts_tag_post_count_view(limit: 20, order_by:{post_count: desc_nulls_last}, where:{tag:{_similar:$query}}) {
    tag
  }
}
`

const styles = (theme: Theme) => createStyles({
  itemContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  item: {
    width: "300px",
    height: "450px",
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
  size: number,
  tags: string[]
}

type Props = StyleProps & InitialProps

const defaultPageSize = 20;

const debouncedFetch = debounce((input, callback, client: ApolloClient<any>) => {
  client.query<GetTagSuggestions, GetTagSuggestionsVariables>({
    query: getTagSuggestions,
    variables: {
      query: `%${input}%`
    }
  }).then(response => {
    callback(response.data.jotts_tag_post_count_view.map(t => t.tag ? t.tag : '').filter(t => t))
  })
}, 250)

const getInitialProps: GetInitialProps<InitialProps, NextContext> = async (context) => {
  const p = context.query['page'];
  const s = context.query['size'];
  const t = context.query['tags'];
  console.log(t)
  const page = p && !(p instanceof Array) ? parseInt(p, 10) : 1;
  const size = s && !(s instanceof Array) ? parseInt(s, 10) : defaultPageSize;
  const tags = t && !(t instanceof Array) ? t.split(",") : []
  return {
    page,
    size,
    tags
  }
}

class Index extends React.Component<Props> {
  public static getInitialProps = getInitialProps;

  public render() {
    return (
      <Layout>
        <div>
          <ApolloConsumer>
            {client => (
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
                      <div>
                        <NoSsr>
                          <MaterialReactSelect
                            options={data.jotts_tag_post_count_view.map(t => t.tag ? t.tag : '').filter(t => t)}
                            loadOptions={(input, callback) => {
                              debouncedFetch(input, callback, client)
                            }}
                            onChange={(selected) => {
                              selected.length > 0 ? Router.push("/?tags=" + selected.join(",")) : Router.push("/")
                            }}
                            defaultSelected={this.props.tags}
                          />
                        </NoSsr>
                      </div>
                      <div className={this.props.classes.itemContainer}>
                        {data.jotts_post_by_tag.map(e => (
                          <Card className={this.props.classes.item} key={e.id}>
                            <Link href={"/post?slug=" + e.slug} as={"/post/" + e.slug}>
                              <a>
                                <Typography variant="h6" className={this.props.classes.itemTitle}>
                                  {e.title}
                                </Typography>
                              </a>
                            </Link>
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
            )}
          </ApolloConsumer>
        </div>
      </Layout>
    )
  }
}

export default withStyles(styles)(Index)
/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPosts
// ====================================================

export interface GetPosts_jotts_post_author {
  __typename: "jotts_user";
  id: any;
  handle: string;
  name: string | null;
}

export interface GetPosts_jotts_post_tags {
  __typename: "jotts_post_tag";
  tag: string;
}

export interface GetPosts_jotts_post {
  __typename: "jotts_post";
  /**
   * An object relationship
   */
  author: GetPosts_jotts_post_author;
  id: any;
  title: string;
  content: string | null;
  /**
   * An array relationship
   */
  tags: GetPosts_jotts_post_tags[];
}

export interface GetPosts_jotts_post_aggregate_aggregate {
  __typename: "jotts_post_aggregate_fields";
  count: number | null;
}

export interface GetPosts_jotts_post_aggregate {
  __typename: "jotts_post_aggregate";
  aggregate: GetPosts_jotts_post_aggregate_aggregate | null;
}

export interface GetPosts {
  /**
   * fetch data from the table: "jotts.post"
   */
  jotts_post: GetPosts_jotts_post[];
  /**
   * fetch aggregated fields from the table: "jotts.post"
   */
  jotts_post_aggregate: GetPosts_jotts_post_aggregate;
}

export interface GetPostsVariables {
  skip: number;
  size: number;
}

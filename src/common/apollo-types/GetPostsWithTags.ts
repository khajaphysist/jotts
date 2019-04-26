/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPostsWithTags
// ====================================================

export interface GetPostsWithTags_jotts_post_by_tag_author {
  __typename: "jotts_user";
  id: any;
  handle: string;
  name: string | null;
}

export interface GetPostsWithTags_jotts_post_by_tag_tags {
  __typename: "jotts_post_tag";
  tag: string;
}

export interface GetPostsWithTags_jotts_post_by_tag {
  __typename: "jotts_post";
  /**
   * An object relationship
   */
  author: GetPostsWithTags_jotts_post_by_tag_author;
  id: any;
  title: string;
  content: string | null;
  slug: string;
  /**
   * An array relationship
   */
  tags: GetPostsWithTags_jotts_post_by_tag_tags[];
}

export interface GetPostsWithTags_jotts_post_by_tag_aggregate_aggregate {
  __typename: "jotts_post_aggregate_fields";
  count: number | null;
}

export interface GetPostsWithTags_jotts_post_by_tag_aggregate {
  __typename: "jotts_post_aggregate";
  aggregate: GetPostsWithTags_jotts_post_by_tag_aggregate_aggregate | null;
}

export interface GetPostsWithTags_jotts_tag_post_count_view {
  __typename: "jotts_tag_post_count_view";
  tag: string | null;
  post_count: any | null;
}

export interface GetPostsWithTags {
  /**
   * execute function "jotts.post_by_tag" which returns "jotts.post"
   */
  jotts_post_by_tag: GetPostsWithTags_jotts_post_by_tag[];
  /**
   * execute function "jotts.post_by_tag" and query aggregates on result of table type "jotts.post"
   */
  jotts_post_by_tag_aggregate: GetPostsWithTags_jotts_post_by_tag_aggregate;
  /**
   * fetch data from the table: "jotts.tag_post_count_view"
   */
  jotts_tag_post_count_view: GetPostsWithTags_jotts_tag_post_count_view[];
}

export interface GetPostsWithTagsVariables {
  skip: number;
  size: number;
  tags: string;
}

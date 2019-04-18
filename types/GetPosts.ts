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

export interface GetPosts_jotts_tag_post_count_view {
  __typename: "jotts_tag_post_count_view";
  tag: string | null;
}

export interface GetPosts {
  /**
   * fetch data from the table: "jotts.post"
   */
  jotts_post: GetPosts_jotts_post[];
  /**
   * fetch data from the table: "jotts.tag_post_count_view"
   */
  jotts_tag_post_count_view: GetPosts_jotts_tag_post_count_view[];
}

export interface GetPostsVariables {
  skip: number;
  size: number;
  tags: string[];
}

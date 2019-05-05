/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserPosts
// ====================================================

export interface GetUserPosts_jotts_post_post_tags {
  __typename: "jotts_post_tag";
  tag: string;
}

export interface GetUserPosts_jotts_post {
  __typename: "jotts_post";
  id: any;
  slug: string;
  title: string;
  content: string | null;
  /**
   * An array relationship
   */
  post_tags: GetUserPosts_jotts_post_post_tags[];
}

export interface GetUserPosts {
  /**
   * fetch data from the table: "jotts.post"
   */
  jotts_post: GetUserPosts_jotts_post[];
}

export interface GetUserPostsVariables {
  authorId: any;
  skip: number;
  size: number;
}

/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPostSummary
// ====================================================

export interface GetPostSummary_jotts_post_author {
  __typename: "jotts_user";
  id: any;
  name: string | null;
  handle: string;
  profile_picture: string | null;
}

export interface GetPostSummary_jotts_post_post_tags {
  __typename: "jotts_post_tag";
  tag: string;
}

export interface GetPostSummary_jotts_post {
  __typename: "jotts_post";
  id: any;
  title: string;
  /**
   * An object relationship
   */
  author: GetPostSummary_jotts_post_author;
  slug: string;
  /**
   * An array relationship
   */
  post_tags: GetPostSummary_jotts_post_post_tags[];
  content: string | null;
  created_at: any;
}

export interface GetPostSummary {
  /**
   * fetch data from the table: "jotts.post"
   */
  jotts_post: GetPostSummary_jotts_post[];
}

export interface GetPostSummaryVariables {
  postId: any;
}

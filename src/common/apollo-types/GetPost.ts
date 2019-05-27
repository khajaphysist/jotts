/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetPost
// ====================================================

export interface GetPost_jotts_post_by_pk_post_tags {
  __typename: "jotts_post_tag";
  tag: string;
}

export interface GetPost_jotts_post_by_pk {
  __typename: "jotts_post";
  id: any;
  title: string;
  slug: string;
  content: string | null;
  is_public: boolean;
  /**
   * An array relationship
   */
  post_tags: GetPost_jotts_post_by_pk_post_tags[];
}

export interface GetPost {
  /**
   * fetch data from the table: "jotts.post" using primary key columns
   */
  jotts_post_by_pk: GetPost_jotts_post_by_pk | null;
}

export interface GetPostVariables {
  id: any;
}

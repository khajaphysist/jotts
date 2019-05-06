/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTopTags
// ====================================================

export interface GetTopTags_jotts_tag_post_count_view {
  __typename: "jotts_tag_post_count_view";
  tag: string | null;
  post_count: any | null;
}

export interface GetTopTags {
  /**
   * fetch data from the table: "jotts.tag_post_count_view"
   */
  jotts_tag_post_count_view: GetTopTags_jotts_tag_post_count_view[];
}

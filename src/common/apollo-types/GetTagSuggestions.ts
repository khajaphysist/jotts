/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTagSuggestions
// ====================================================

export interface GetTagSuggestions_jotts_tag_post_count_view {
  __typename: "jotts_tag_post_count_view";
  tag: string | null;
}

export interface GetTagSuggestions {
  /**
   * fetch data from the table: "jotts.tag_post_count_view"
   */
  jotts_tag_post_count_view: GetTagSuggestions_jotts_tag_post_count_view[];
}

export interface GetTagSuggestionsVariables {
  query: string;
}

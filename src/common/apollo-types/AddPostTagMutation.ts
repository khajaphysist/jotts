/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { jotts_post_tag_insert_input } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddPostTagMutation
// ====================================================

export interface AddPostTagMutation_insert_jotts_post_tag_returning {
  __typename: "jotts_post_tag";
  post_id: any;
  tag: string;
}

export interface AddPostTagMutation_insert_jotts_post_tag {
  __typename: "jotts_post_tag_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: AddPostTagMutation_insert_jotts_post_tag_returning[];
}

export interface AddPostTagMutation {
  /**
   * insert data into the table: "jotts.post_tag"
   */
  insert_jotts_post_tag: AddPostTagMutation_insert_jotts_post_tag | null;
}

export interface AddPostTagMutationVariables {
  objects: jotts_post_tag_insert_input[];
}

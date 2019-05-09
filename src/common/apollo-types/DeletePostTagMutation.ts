/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePostTagMutation
// ====================================================

export interface DeletePostTagMutation_delete_jotts_post_tag_returning {
  __typename: "jotts_post_tag";
  post_id: any;
  tag: string;
}

export interface DeletePostTagMutation_delete_jotts_post_tag {
  __typename: "jotts_post_tag_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: DeletePostTagMutation_delete_jotts_post_tag_returning[];
}

export interface DeletePostTagMutation {
  /**
   * delete data from the table: "jotts.post_tag"
   */
  delete_jotts_post_tag: DeletePostTagMutation_delete_jotts_post_tag | null;
}

export interface DeletePostTagMutationVariables {
  postId: any;
  tag: string;
}

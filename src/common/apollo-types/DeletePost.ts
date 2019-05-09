/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePost
// ====================================================

export interface DeletePost_delete_jotts_post_returning {
  __typename: "jotts_post";
  id: any;
}

export interface DeletePost_delete_jotts_post {
  __typename: "jotts_post_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: DeletePost_delete_jotts_post_returning[];
}

export interface DeletePost {
  /**
   * delete data from the table: "jotts.post"
   */
  delete_jotts_post: DeletePost_delete_jotts_post | null;
}

export interface DeletePostVariables {
  postId: any;
}

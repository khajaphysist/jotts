/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: TogglePostPublicStatus
// ====================================================

export interface TogglePostPublicStatus_update_jotts_post_returning {
  __typename: "jotts_post";
  id: any;
  is_public: boolean;
}

export interface TogglePostPublicStatus_update_jotts_post {
  __typename: "jotts_post_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: TogglePostPublicStatus_update_jotts_post_returning[];
}

export interface TogglePostPublicStatus {
  /**
   * update data of the table: "jotts.post"
   */
  update_jotts_post: TogglePostPublicStatus_update_jotts_post | null;
}

export interface TogglePostPublicStatusVariables {
  postId: any;
  isPublic: boolean;
}

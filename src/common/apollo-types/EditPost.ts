/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditPost
// ====================================================

export interface EditPost_update_jotts_post_returning {
  __typename: "jotts_post";
  id: any;
  title: string;
  content: string | null;
  summary: string | null;
}

export interface EditPost_update_jotts_post {
  __typename: "jotts_post_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: EditPost_update_jotts_post_returning[];
}

export interface EditPost {
  /**
   * update data of the table: "jotts.post"
   */
  update_jotts_post: EditPost_update_jotts_post | null;
}

export interface EditPostVariables {
  id: any;
  title: string;
  slug: string;
  content?: string | null;
  text?: string | null;
  summary?: string | null;
}

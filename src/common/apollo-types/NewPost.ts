/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { jotts_post_insert_input } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: NewPost
// ====================================================

export interface NewPost_insert_jotts_post_returning {
  __typename: "jotts_post";
  id: any;
  title: string;
}

export interface NewPost_insert_jotts_post {
  __typename: "jotts_post_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: NewPost_insert_jotts_post_returning[];
}

export interface NewPost {
  /**
   * insert data into the table: "jotts.post"
   */
  insert_jotts_post: NewPost_insert_jotts_post | null;
}

export interface NewPostVariables {
  newPost: jotts_post_insert_input;
}

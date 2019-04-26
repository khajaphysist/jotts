/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_jotts_user {
  __typename: "jotts_user";
  id: any;
  name: string | null;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  email: string;
  profile_picture: string | null;
  handle: string;
}

export interface GetUser {
  /**
   * fetch data from the table: "jotts.user"
   */
  jotts_user: GetUser_jotts_user[];
}

export interface GetUserVariables {
  email: string;
}

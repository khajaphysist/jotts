/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllUsers
// ====================================================

export interface GetAllUsers_jotts_user {
  __typename: "jotts_user";
  email: string;
}

export interface GetAllUsers {
  /**
   * fetch data from the table: "jotts.user"
   */
  jotts_user: GetAllUsers_jotts_user[];
}

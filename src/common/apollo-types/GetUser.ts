/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_jotts_user_by_pk {
  __typename: "jotts_user";
  name: string | null;
  handle: string;
  country: string | null;
  profile_picture: string | null;
}

export interface GetUser {
  /**
   * fetch data from the table: "jotts.user" using primary key columns
   */
  jotts_user_by_pk: GetUser_jotts_user_by_pk | null;
}

export interface GetUserVariables {
  id: any;
}

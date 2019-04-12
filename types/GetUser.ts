/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUser
// ====================================================

export interface GetUser_jotts_profile {
  __typename: "jotts_profile";
  id: any;
  handle: string;
  name: string | null;
}

export interface GetUser {
  /**
   * fetch data from the table: "jotts.profile"
   */
  jotts_profile: GetUser_jotts_profile[];
}

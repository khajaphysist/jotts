/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserProfile
// ====================================================

export interface GetUserProfile_jotts_user_by_pk {
  __typename: "jotts_user";
  id: any;
  name: string | null;
  country: string | null;
  profile_picture: string | null;
}

export interface GetUserProfile {
  /**
   * fetch data from the table: "jotts.user" using primary key columns
   */
  jotts_user_by_pk: GetUserProfile_jotts_user_by_pk | null;
}

export interface GetUserProfileVariables {
  userId: any;
}

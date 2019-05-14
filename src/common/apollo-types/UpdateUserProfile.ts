/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateUserProfile
// ====================================================

export interface UpdateUserProfile_update_jotts_user_returning {
  __typename: "jotts_user";
  id: any;
  name: string | null;
  country: string | null;
  profile_picture: string | null;
}

export interface UpdateUserProfile_update_jotts_user {
  __typename: "jotts_user_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: UpdateUserProfile_update_jotts_user_returning[];
}

export interface UpdateUserProfile {
  /**
   * update data of the table: "jotts.user"
   */
  update_jotts_user: UpdateUserProfile_update_jotts_user | null;
}

export interface UpdateUserProfileVariables {
  userId: any;
  name?: string | null;
  country?: string | null;
  profilePicture?: string | null;
}

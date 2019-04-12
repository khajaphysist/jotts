/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterUser
// ====================================================

export interface RegisterUser_insert_jotts_profile_returning {
  __typename: "jotts_profile";
  id: any;
}

export interface RegisterUser_insert_jotts_profile {
  __typename: "jotts_profile_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: RegisterUser_insert_jotts_profile_returning[];
}

export interface RegisterUser {
  /**
   * insert data into the table: "jotts.profile"
   */
  insert_jotts_profile: RegisterUser_insert_jotts_profile | null;
}

export interface RegisterUserVariables {
  username: string;
  email: string;
  password_hash: string;
  password_salt: string;
  password_iterations?: number | null;
}

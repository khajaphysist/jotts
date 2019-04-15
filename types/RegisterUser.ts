/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RegisterUser
// ====================================================

export interface RegisterUser_insert_jotts_user_returning {
  __typename: "jotts_user";
  id: any;
}

export interface RegisterUser_insert_jotts_user {
  __typename: "jotts_user_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: RegisterUser_insert_jotts_user_returning[];
}

export interface RegisterUser {
  /**
   * insert data into the table: "jotts.user"
   */
  insert_jotts_user: RegisterUser_insert_jotts_user | null;
}

export interface RegisterUserVariables {
  handle: string;
  email: string;
  password_hash: string;
  password_salt: string;
  password_iterations?: number | null;
}

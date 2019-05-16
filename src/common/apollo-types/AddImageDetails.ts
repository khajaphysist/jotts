/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddImageDetails
// ====================================================

export interface AddImageDetails_insert_jotts_image {
  __typename: "jotts_image_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface AddImageDetails {
  /**
   * insert data into the table: "jotts.image"
   */
  insert_jotts_image: AddImageDetails_insert_jotts_image | null;
}

export interface AddImageDetailsVariables {
  imageId: string;
  name: string;
}

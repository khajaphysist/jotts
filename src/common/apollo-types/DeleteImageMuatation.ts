/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteImageMuatation
// ====================================================

export interface DeleteImageMuatation_delete_jotts_image {
  __typename: "jotts_image_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
}

export interface DeleteImageMuatation {
  /**
   * delete data from the table: "jotts.image"
   */
  delete_jotts_image: DeleteImageMuatation_delete_jotts_image | null;
}

export interface DeleteImageMuatationVariables {
  imgId: string;
}

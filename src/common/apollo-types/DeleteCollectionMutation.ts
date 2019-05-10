/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteCollectionMutation
// ====================================================

export interface DeleteCollectionMutation_delete_jotts_collection_returning {
  __typename: "jotts_collection";
  id: any;
}

export interface DeleteCollectionMutation_delete_jotts_collection {
  __typename: "jotts_collection_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: DeleteCollectionMutation_delete_jotts_collection_returning[];
}

export interface DeleteCollectionMutation {
  /**
   * delete data from the table: "jotts.collection"
   */
  delete_jotts_collection: DeleteCollectionMutation_delete_jotts_collection | null;
}

export interface DeleteCollectionMutationVariables {
  id: any;
}

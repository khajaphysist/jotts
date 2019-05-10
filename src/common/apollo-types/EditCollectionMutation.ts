/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditCollectionMutation
// ====================================================

export interface EditCollectionMutation_update_jotts_collection_returning {
  __typename: "jotts_collection";
  id: any;
  title: string;
  slug: string;
}

export interface EditCollectionMutation_update_jotts_collection {
  __typename: "jotts_collection_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: EditCollectionMutation_update_jotts_collection_returning[];
}

export interface EditCollectionMutation {
  /**
   * update data of the table: "jotts.collection"
   */
  update_jotts_collection: EditCollectionMutation_update_jotts_collection | null;
}

export interface EditCollectionMutationVariables {
  id: any;
  title: string;
  slug: string;
}

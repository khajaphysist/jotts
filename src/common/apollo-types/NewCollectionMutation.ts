/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NewCollectionMutation
// ====================================================

export interface NewCollectionMutation_insert_jotts_collection_returning {
  __typename: "jotts_collection";
  id: any;
}

export interface NewCollectionMutation_insert_jotts_collection {
  __typename: "jotts_collection_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: NewCollectionMutation_insert_jotts_collection_returning[];
}

export interface NewCollectionMutation {
  /**
   * insert data into the table: "jotts.collection"
   */
  insert_jotts_collection: NewCollectionMutation_insert_jotts_collection | null;
}

export interface NewCollectionMutationVariables {
  title: string;
  slug: string;
  authorId: any;
  id: any;
}

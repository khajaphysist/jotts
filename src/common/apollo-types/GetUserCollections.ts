/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUserCollections
// ====================================================

export interface GetUserCollections_jotts_collection {
  __typename: "jotts_collection";
  id: any;
  title: string;
  slug: string;
}

export interface GetUserCollections {
  /**
   * fetch data from the table: "jotts.collection"
   */
  jotts_collection: GetUserCollections_jotts_collection[];
}

export interface GetUserCollectionsVariables {
  authorId: any;
}

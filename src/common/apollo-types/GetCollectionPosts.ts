/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetCollectionPosts
// ====================================================

export interface GetCollectionPosts_jotts_collection_post_post {
  __typename: "jotts_post";
  id: any;
  title: string;
}

export interface GetCollectionPosts_jotts_collection_post {
  __typename: "jotts_collection_post";
  collection_id: any;
  /**
   * An object relationship
   */
  post: GetCollectionPosts_jotts_collection_post_post;
}

export interface GetCollectionPosts {
  /**
   * fetch data from the table: "jotts.collection_post"
   */
  jotts_collection_post: GetCollectionPosts_jotts_collection_post[];
}

export interface GetCollectionPostsVariables {
  collectionId: any;
}

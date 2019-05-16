/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetFolderPosts
// ====================================================

export interface GetFolderPosts_jotts_post {
  __typename: "jotts_post";
  id: any;
  folder_id: any | null;
  title: string;
}

export interface GetFolderPosts {
  /**
   * fetch data from the table: "jotts.post"
   */
  jotts_post: GetFolderPosts_jotts_post[];
}

export interface GetFolderPostsVariables {
  folderId: any;
}

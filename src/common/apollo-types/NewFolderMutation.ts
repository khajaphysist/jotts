/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: NewFolderMutation
// ====================================================

export interface NewFolderMutation_insert_jotts_folder_returning {
  __typename: "jotts_folder";
  id: any;
}

export interface NewFolderMutation_insert_jotts_folder {
  __typename: "jotts_folder_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: NewFolderMutation_insert_jotts_folder_returning[];
}

export interface NewFolderMutation {
  /**
   * insert data into the table: "jotts.folder"
   */
  insert_jotts_folder: NewFolderMutation_insert_jotts_folder | null;
}

export interface NewFolderMutationVariables {
  title: string;
  slug: string;
  authorId: any;
  id: any;
  parentId?: any | null;
}

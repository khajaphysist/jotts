/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditFolderMutation
// ====================================================

export interface EditFolderMutation_update_jotts_folder_returning {
  __typename: "jotts_folder";
  id: any;
  title: string;
  slug: string;
}

export interface EditFolderMutation_update_jotts_folder {
  __typename: "jotts_folder_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: EditFolderMutation_update_jotts_folder_returning[];
}

export interface EditFolderMutation {
  /**
   * update data of the table: "jotts.folder"
   */
  update_jotts_folder: EditFolderMutation_update_jotts_folder | null;
}

export interface EditFolderMutationVariables {
  id: any;
  title: string;
  slug: string;
}

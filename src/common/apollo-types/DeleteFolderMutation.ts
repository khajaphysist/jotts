/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteFolderMutation
// ====================================================

export interface DeleteFolderMutation_delete_jotts_folder_returning {
  __typename: "jotts_folder";
  id: any;
}

export interface DeleteFolderMutation_delete_jotts_folder {
  __typename: "jotts_folder_mutation_response";
  /**
   * number of affected rows by the mutation
   */
  affected_rows: number;
  /**
   * data of the affected rows by the mutation
   */
  returning: DeleteFolderMutation_delete_jotts_folder_returning[];
}

export interface DeleteFolderMutation {
  /**
   * delete data from the table: "jotts.folder"
   */
  delete_jotts_folder: DeleteFolderMutation_delete_jotts_folder | null;
}

export interface DeleteFolderMutationVariables {
  id: any;
}

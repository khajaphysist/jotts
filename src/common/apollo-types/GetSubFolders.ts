/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { uuid_comparison_exp } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetSubFolders
// ====================================================

export interface GetSubFolders_jotts_folder {
  __typename: "jotts_folder";
  id: any;
  slug: string;
  title: string;
  parent_id: any | null;
}

export interface GetSubFolders {
  /**
   * fetch data from the table: "jotts.folder"
   */
  jotts_folder: GetSubFolders_jotts_folder[];
}

export interface GetSubFoldersVariables {
  parentCondition?: uuid_comparison_exp | null;
  authorId: any;
}

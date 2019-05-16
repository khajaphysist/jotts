/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllUserImages
// ====================================================

export interface GetAllUserImages_jotts_image {
  __typename: "jotts_image";
  id: string;
  author_id: any;
  name: string;
}

export interface GetAllUserImages {
  /**
   * fetch data from the table: "jotts.image"
   */
  jotts_image: GetAllUserImages_jotts_image[];
}

export interface GetAllUserImagesVariables {
  authorId: any;
}

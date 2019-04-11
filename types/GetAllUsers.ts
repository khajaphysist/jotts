/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAllUsers
// ====================================================

export interface GetAllUsers_user_posts_tags_tag {
  __typename: "tags";
  slug: string;
}

export interface GetAllUsers_user_posts_tags {
  __typename: "post_tags";
  /**
   * An object relationship
   */
  tag: GetAllUsers_user_posts_tags_tag;
}

export interface GetAllUsers_user_posts {
  __typename: "post";
  /**
   * An array relationship
   */
  tags: GetAllUsers_user_posts_tags[];
}

export interface GetAllUsers_user {
  __typename: "user";
  id: any;
  username: string;
  email: string;
  /**
   * An array relationship
   */
  posts: GetAllUsers_user_posts[];
}

export interface GetAllUsers {
  /**
   * fetch data from the table: "user"
   */
  user: GetAllUsers_user[];
}

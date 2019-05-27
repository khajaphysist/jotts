/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * unique or primary key constraints on table "jotts.folder"
 */
export enum jotts_folder_constraint {
  folder_pkey = "folder_pkey",
  folder_slug_key = "folder_slug_key",
}

/**
 * update columns of table "jotts.folder"
 */
export enum jotts_folder_update_column {
  author_id = "author_id",
  id = "id",
  parent_id = "parent_id",
  slug = "slug",
  title = "title",
}

/**
 * unique or primary key constraints on table "jotts.image"
 */
export enum jotts_image_constraint {
  image_name_author_id_key = "image_name_author_id_key",
  image_pkey = "image_pkey",
}

/**
 * update columns of table "jotts.image"
 */
export enum jotts_image_update_column {
  author_id = "author_id",
  id = "id",
  name = "name",
}

/**
 * unique or primary key constraints on table "jotts.post"
 */
export enum jotts_post_constraint {
  post_pkey = "post_pkey",
  post_slug_key = "post_slug_key",
}

/**
 * unique or primary key constraints on table "jotts.post_tag"
 */
export enum jotts_post_tag_constraint {
  post_tag_pkey = "post_tag_pkey",
}

/**
 * update columns of table "jotts.post_tag"
 */
export enum jotts_post_tag_update_column {
  post_id = "post_id",
  tag = "tag",
}

/**
 * update columns of table "jotts.post"
 */
export enum jotts_post_update_column {
  author_id = "author_id",
  content = "content",
  created_at = "created_at",
  folder_id = "folder_id",
  id = "id",
  is_public = "is_public",
  slug = "slug",
  summary = "summary",
  text = "text",
  title = "title",
  updated_at = "updated_at",
}

/**
 * unique or primary key constraints on table "jotts.tag"
 */
export enum jotts_tag_constraint {
  tag_pkey = "tag_pkey",
}

/**
 * update columns of table "jotts.tag"
 */
export enum jotts_tag_update_column {
  tag = "tag",
}

/**
 * unique or primary key constraints on table "jotts.user"
 */
export enum jotts_user_constraint {
  user_handle_key = "user_handle_key",
  user_pkey = "user_pkey",
}

/**
 * update columns of table "jotts.user"
 */
export enum jotts_user_update_column {
  country = "country",
  handle = "handle",
  id = "id",
  name = "name",
  profile_picture = "profile_picture",
}

/**
 * input type for inserting array relation for remote table "jotts.folder"
 */
export interface jotts_folder_arr_rel_insert_input {
  data: jotts_folder_insert_input[];
  on_conflict?: jotts_folder_on_conflict | null;
}

/**
 * input type for inserting data into table "jotts.folder"
 */
export interface jotts_folder_insert_input {
  author?: jotts_user_obj_rel_insert_input | null;
  author_id?: any | null;
  folders?: jotts_folder_arr_rel_insert_input | null;
  id?: any | null;
  parent_folder?: jotts_folder_obj_rel_insert_input | null;
  parent_id?: any | null;
  posts?: jotts_post_arr_rel_insert_input | null;
  slug?: string | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "jotts.folder"
 */
export interface jotts_folder_obj_rel_insert_input {
  data: jotts_folder_insert_input;
  on_conflict?: jotts_folder_on_conflict | null;
}

/**
 * on conflict condition type for table "jotts.folder"
 */
export interface jotts_folder_on_conflict {
  constraint: jotts_folder_constraint;
  update_columns: jotts_folder_update_column[];
}

/**
 * input type for inserting array relation for remote table "jotts.image"
 */
export interface jotts_image_arr_rel_insert_input {
  data: jotts_image_insert_input[];
  on_conflict?: jotts_image_on_conflict | null;
}

/**
 * input type for inserting data into table "jotts.image"
 */
export interface jotts_image_insert_input {
  author?: jotts_user_obj_rel_insert_input | null;
  author_id?: any | null;
  id?: string | null;
  name?: string | null;
}

/**
 * on conflict condition type for table "jotts.image"
 */
export interface jotts_image_on_conflict {
  constraint: jotts_image_constraint;
  update_columns: jotts_image_update_column[];
}

/**
 * input type for inserting array relation for remote table "jotts.post"
 */
export interface jotts_post_arr_rel_insert_input {
  data: jotts_post_insert_input[];
  on_conflict?: jotts_post_on_conflict | null;
}

/**
 * input type for inserting data into table "jotts.post"
 */
export interface jotts_post_insert_input {
  author?: jotts_user_obj_rel_insert_input | null;
  author_id?: any | null;
  content?: string | null;
  created_at?: any | null;
  folder?: jotts_folder_obj_rel_insert_input | null;
  folder_id?: any | null;
  id?: any | null;
  is_public?: boolean | null;
  post_tags?: jotts_post_tag_arr_rel_insert_input | null;
  slug?: string | null;
  summary?: string | null;
  text?: string | null;
  title?: string | null;
  updated_at?: any | null;
}

/**
 * input type for inserting object relation for remote table "jotts.post"
 */
export interface jotts_post_obj_rel_insert_input {
  data: jotts_post_insert_input;
  on_conflict?: jotts_post_on_conflict | null;
}

/**
 * on conflict condition type for table "jotts.post"
 */
export interface jotts_post_on_conflict {
  constraint: jotts_post_constraint;
  update_columns: jotts_post_update_column[];
}

/**
 * input type for inserting array relation for remote table "jotts.post_tag"
 */
export interface jotts_post_tag_arr_rel_insert_input {
  data: jotts_post_tag_insert_input[];
  on_conflict?: jotts_post_tag_on_conflict | null;
}

/**
 * input type for inserting data into table "jotts.post_tag"
 */
export interface jotts_post_tag_insert_input {
  post?: jotts_post_obj_rel_insert_input | null;
  post_id?: any | null;
  tag?: string | null;
  tagByTag?: jotts_tag_obj_rel_insert_input | null;
}

/**
 * on conflict condition type for table "jotts.post_tag"
 */
export interface jotts_post_tag_on_conflict {
  constraint: jotts_post_tag_constraint;
  update_columns: jotts_post_tag_update_column[];
}

/**
 * input type for inserting data into table "jotts.tag"
 */
export interface jotts_tag_insert_input {
  post_tags?: jotts_post_tag_arr_rel_insert_input | null;
  tag?: string | null;
}

/**
 * input type for inserting object relation for remote table "jotts.tag"
 */
export interface jotts_tag_obj_rel_insert_input {
  data: jotts_tag_insert_input;
  on_conflict?: jotts_tag_on_conflict | null;
}

/**
 * on conflict condition type for table "jotts.tag"
 */
export interface jotts_tag_on_conflict {
  constraint: jotts_tag_constraint;
  update_columns: jotts_tag_update_column[];
}

/**
 * input type for inserting data into table "jotts.user"
 */
export interface jotts_user_insert_input {
  country?: string | null;
  folders?: jotts_folder_arr_rel_insert_input | null;
  handle?: string | null;
  id?: any | null;
  images?: jotts_image_arr_rel_insert_input | null;
  name?: string | null;
  posts?: jotts_post_arr_rel_insert_input | null;
  profile_picture?: string | null;
}

/**
 * input type for inserting object relation for remote table "jotts.user"
 */
export interface jotts_user_obj_rel_insert_input {
  data: jotts_user_insert_input;
  on_conflict?: jotts_user_on_conflict | null;
}

/**
 * on conflict condition type for table "jotts.user"
 */
export interface jotts_user_on_conflict {
  constraint: jotts_user_constraint;
  update_columns: jotts_user_update_column[];
}

/**
 * expression to compare columns of type uuid. All fields are combined with logical 'AND'.
 */
export interface uuid_comparison_exp {
  _eq?: any | null;
  _gt?: any | null;
  _gte?: any | null;
  _in?: (any | null)[] | null;
  _is_null?: boolean | null;
  _lt?: any | null;
  _lte?: any | null;
  _neq?: any | null;
  _nin?: (any | null)[] | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================

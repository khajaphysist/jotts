/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * unique or primary key constraints on table "jotts.collection"
 */
export enum jotts_collection_constraint {
  collection_pkey = "collection_pkey",
  collection_slug_key = "collection_slug_key",
}

/**
 * unique or primary key constraints on table "jotts.collection_post"
 */
export enum jotts_collection_post_constraint {
  collection_post_pkey = "collection_post_pkey",
}

/**
 * update columns of table "jotts.collection_post"
 */
export enum jotts_collection_post_update_column {
  collection_id = "collection_id",
  post_id = "post_id",
}

/**
 * update columns of table "jotts.collection"
 */
export enum jotts_collection_update_column {
  author_id = "author_id",
  description = "description",
  id = "id",
  slug = "slug",
  title = "title",
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
  id = "id",
  slug = "slug",
  title = "title",
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
 * input type for inserting array relation for remote table "jotts.collection"
 */
export interface jotts_collection_arr_rel_insert_input {
  data: jotts_collection_insert_input[];
  on_conflict?: jotts_collection_on_conflict | null;
}

/**
 * input type for inserting data into table "jotts.collection"
 */
export interface jotts_collection_insert_input {
  author?: jotts_user_obj_rel_insert_input | null;
  author_id?: any | null;
  collection_posts?: jotts_collection_post_arr_rel_insert_input | null;
  description?: string | null;
  id?: any | null;
  slug?: string | null;
  title?: string | null;
}

/**
 * input type for inserting object relation for remote table "jotts.collection"
 */
export interface jotts_collection_obj_rel_insert_input {
  data: jotts_collection_insert_input;
  on_conflict?: jotts_collection_on_conflict | null;
}

/**
 * on conflict condition type for table "jotts.collection"
 */
export interface jotts_collection_on_conflict {
  constraint: jotts_collection_constraint;
  update_columns: jotts_collection_update_column[];
}

/**
 * input type for inserting array relation for remote table "jotts.collection_post"
 */
export interface jotts_collection_post_arr_rel_insert_input {
  data: jotts_collection_post_insert_input[];
  on_conflict?: jotts_collection_post_on_conflict | null;
}

/**
 * input type for inserting data into table "jotts.collection_post"
 */
export interface jotts_collection_post_insert_input {
  collection?: jotts_collection_obj_rel_insert_input | null;
  collection_id?: any | null;
  post?: jotts_post_obj_rel_insert_input | null;
  post_id?: any | null;
}

/**
 * on conflict condition type for table "jotts.collection_post"
 */
export interface jotts_collection_post_on_conflict {
  constraint: jotts_collection_post_constraint;
  update_columns: jotts_collection_post_update_column[];
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
  collection_posts?: jotts_collection_post_arr_rel_insert_input | null;
  content?: string | null;
  id?: any | null;
  post_tags?: jotts_post_tag_arr_rel_insert_input | null;
  slug?: string | null;
  title?: string | null;
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
  collections?: jotts_collection_arr_rel_insert_input | null;
  country?: string | null;
  handle?: string | null;
  id?: any | null;
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

//==============================================================
// END Enums and Input Objects
//==============================================================

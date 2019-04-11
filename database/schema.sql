CREATE SCHEMA IF NOT EXISTS jotts;

CREATE TABLE jotts.collection (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    description text,
    author_id uuid NOT NULL
);

CREATE TABLE jotts.collection_post (
    collection_id uuid NOT NULL,
    post_id uuid NOT NULL
);

CREATE TABLE jotts.follow_table (
    master uuid NOT NULL,
    follower uuid NOT NULL,
    tag_id uuid NOT NULL
);

CREATE TABLE jotts.post (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid NOT NULL
);

CREATE TABLE jotts.post_tags (
    post_id uuid NOT NULL,
    tag_id uuid NOT NULL
);

CREATE TABLE jotts.tags (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL
);

CREATE TABLE jotts."user" (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL,
    password_salt text DEFAULT 'salt'::text NOT NULL,
    profile_picture text,
    country text
);

ALTER TABLE ONLY jotts.collection
    ADD CONSTRAINT collection_pkey PRIMARY KEY (id);

ALTER TABLE ONLY jotts.collection_post
    ADD CONSTRAINT collection_post_pkey PRIMARY KEY (collection_id, post_id);

ALTER TABLE ONLY jotts.follow_table
    ADD CONSTRAINT follow_table_pkey PRIMARY KEY (master, follower);

ALTER TABLE ONLY jotts.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);

ALTER TABLE ONLY jotts.post
    ADD CONSTRAINT post_slug_key UNIQUE (slug);

ALTER TABLE ONLY jotts.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id);

ALTER TABLE ONLY jotts.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);

ALTER TABLE ONLY jotts.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);

ALTER TABLE ONLY jotts.tags
    ADD CONSTRAINT tags_slug_key UNIQUE (slug);

ALTER TABLE ONLY jotts."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);

ALTER TABLE ONLY jotts."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);

ALTER TABLE ONLY jotts."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);

ALTER TABLE ONLY jotts.collection
    ADD CONSTRAINT collection_author_id_fkey FOREIGN KEY (author_id) REFERENCES jotts."user"(id) ON UPDATE RESTRICT;

ALTER TABLE ONLY jotts.collection_post
    ADD CONSTRAINT collection_post_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES jotts.collection(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY jotts.collection_post
    ADD CONSTRAINT collection_post_post_id_fkey FOREIGN KEY (post_id) REFERENCES jotts.post(id) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE ONLY jotts.follow_table
    ADD CONSTRAINT follow_table_follower_fkey FOREIGN KEY (follower) REFERENCES jotts."user"(id);

ALTER TABLE ONLY jotts.follow_table
    ADD CONSTRAINT follow_table_master_fkey FOREIGN KEY (master) REFERENCES jotts."user"(id);

ALTER TABLE ONLY jotts.follow_table
    ADD CONSTRAINT follow_table_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES jotts.tags(id);

ALTER TABLE ONLY jotts.post
    ADD CONSTRAINT post_author_id_fkey FOREIGN KEY (author_id) REFERENCES jotts."user"(id);

ALTER TABLE ONLY jotts.post_tags
    ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES jotts.post(id);

ALTER TABLE ONLY jotts.post_tags
    ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES jotts.tags(id);

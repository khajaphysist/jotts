CREATE SCHEMA jotts;

CREATE TABLE jotts.profile (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    username text NOT NULL UNIQUE,
    name text,
    profile_picture text,
    country text
);

CREATE TABLE jotts."user" (
    user_id uuid NOT NULL REFERENCES jotts.profile ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    password_salt text NOT NULL,
    password_iterations int NOT NULL CHECK (password_iterations>0),
    PRIMARY KEY (user_id)
);

CREATE TABLE jotts.post (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    content text,
    author_id uuid NOT NULL REFERENCES jotts.profile
);

CREATE TABLE jotts.tag (
    tag text PRIMARY KEY
);

CREATE TABLE jotts.post_tag (
    post_id uuid NOT NULL REFERENCES jotts.post ON DELETE CASCADE,
    tag text NOT NULL REFERENCES jotts.tag ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag)
);

CREATE TABLE jotts.collection (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    description text,
    author_id uuid NOT NULL REFERENCES jotts.profile ON DELETE CASCADE
);

CREATE TABLE jotts.collection_post (
    collection_id uuid REFERENCES jotts.collection ON DELETE CASCADE,
    post_id uuid REFERENCES jotts.post ON DELETE CASCADE,
    PRIMARY KEY (collection_id, post_id)
);

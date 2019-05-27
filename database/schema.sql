CREATE SCHEMA jotts;

CREATE TABLE jotts."user" (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    handle text NOT NULL UNIQUE,
    name text,
    profile_picture text,
    country text
);

CREATE TABLE jotts.login_details (
    id uuid NOT NULL REFERENCES jotts."user",
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    password_salt text NOT NULL,
    password_iterations int NOT NULL CHECK (password_iterations>0),
    PRIMARY KEY (id)
);

CREATE TABLE jotts.folder (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    author_id uuid NOT NULL REFERENCES jotts."user" ON DELETE CASCADE,
    parent_id uuid REFERENCES jotts.folder ON DELETE CASCADE
);

CREATE TABLE jotts.post (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    title text NOT NULL,
    summary text,
    text text,
    content text,
    author_id uuid NOT NULL REFERENCES jotts."user",
    folder_id uuid REFERENCES jotts.folder ON DELETE CASCADE,
    is_public boolean NOT NULL DEFAULT FALSE,
    created_at timestamp DEFAULT now() NOT NULL,
    updated_at timestamp DEFAULT now() NOT NULL
);

CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_timestamp
BEFORE UPDATE ON jotts.post
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TABLE jotts.tag (
    tag text PRIMARY KEY
);

CREATE TABLE jotts.post_tag (
    post_id uuid NOT NULL REFERENCES jotts.post ON DELETE CASCADE,
    tag text NOT NULL REFERENCES jotts.tag ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag)
);

CREATE VIEW jotts.tag_post_count_view AS
SELECT jotts.tag.tag as tag, count(post_id) AS post_count from
jotts.tag LEFT JOIN jotts.post_tag
ON jotts.tag.tag = jotts.post_tag.tag
GROUP BY jotts.tag.tag
ORDER BY post_count DESC;

CREATE OR REPLACE FUNCTION jotts.post_by_tag(text) RETURNS setof jotts.post AS $$
SELECT * FROM jotts.post
WHERE
    (($1 = '') IS NOT FALSE)
OR 
  jotts.post.id in (
    SELECT jotts.post.id FROM
    jotts.post JOIN jotts.post_tag 
    on jotts.post.id = jotts.post_tag.post_id
    WHERE jotts.post_tag.tag = any(string_to_array($1,','))
    GROUP BY jotts.post.id
    HAVING count(*) = array_length(string_to_array($1,','),1)
  )
$$ LANGUAGE SQL STABLE;

CREATE TABLE jotts.image (
    id text PRIMARY KEY,
    name text NOT NULL,
    author_id uuid NOT NULL REFERENCES jotts."user" ON DELETE CASCADE,
    UNIQUE (name, author_id)
);
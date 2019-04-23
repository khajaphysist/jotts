CREATE VIEW jotts.tag_post_count_view AS
SELECT jotts.tag.tag as tag, count(post_id) AS post_count from
jotts.tag JOIN jotts.post_tag
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


SELECT jotts.tag.tag, levenshtein('ui'::TEXT, jotts.tag.tag), jotts.tag_post_count_view.post_count
FROM jotts.tag JOIN jotts.tag_post_count_view
ON jotts.tag.tag = jotts.tag_post_count_view.tag
WHERE jotts.tag.tag LIKE '%ui%'
ORDER BY jotts.tag_post_count_view.post_count DESC;
CREATE VIEW jotts.tag_post_count_view AS
SELECT jotts.tag.tag as tag, count(post_id) AS post_count from
jotts.tag JOIN jotts.post_tag
ON jotts.tag.tag = jotts.post_tag.tag
GROUP BY jotts.tag.tag
ORDER BY post_count DESC;
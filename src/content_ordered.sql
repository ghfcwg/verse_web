select CONTENT,
    to_number(REGEXP_REPLACE(
    REGEXP_SUBSTR(
        XPATH,'.+(\[.+)$',1,1,'im',1
    )
    , '[^0-9]', '') )
    ordr, URL
 from VERSE where url = 'https://godible.org/blogs/daily-godible/cheon-seong-gyeong-episode-290'
order by url, ordr
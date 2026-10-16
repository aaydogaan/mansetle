DO $$
DECLARE
  rec RECORD;
  new_slug TEXT;
  counter INT;
  final_slug TEXT;
BEGIN
  FOR rec IN SELECT id, title FROM news_articles LOOP
    new_slug := lower(
      trim(both '-' from
        regexp_replace(
          regexp_replace(
            translate(rec.title, 'çÇğĞıIİöÖşŞüÜÂâÎîÛû', 'ccggiioossuuaaiiuu'),
            '[^a-zA-Z0-9\s-]', '', 'g'
          ),
          '[\s-]+', '-', 'g'
        )
      )
    );
    IF length(new_slug) > 85 THEN
      new_slug := substr(new_slug, 1, 85);
      new_slug := trim(both '-' from new_slug);
    END IF;
    IF length(new_slug) = 0 THEN
      new_slug := 'haber-' || rec.id;
    END IF;

    final_slug := new_slug;
    counter := 1;
    WHILE EXISTS (SELECT 1 FROM news_articles WHERE slug = final_slug AND id <> rec.id) LOOP
      counter := counter + 1;
      final_slug := new_slug || '-' || counter;
    END LOOP;

    UPDATE news_articles SET slug = final_slug WHERE id = rec.id;
  END LOOP;
END $$;

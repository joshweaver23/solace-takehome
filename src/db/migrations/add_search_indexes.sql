-- Database indexes for advocate search performance

-- This enables fast searching across names, city, and degree
CREATE INDEX idx_advocates_text_search ON advocates
USING gin(to_tsvector('english',
  coalesce(first_name, '') || ' ' ||
  coalesce(last_name, '') || ' ' ||
  coalesce(city, '') || ' ' ||
  coalesce(degree, '')
));


-- Enables indexing on individual specialties within the JSONB
CREATE INDEX idx_advocates_specialties ON advocates
USING gin(specialties);


-- Speeds up ORDER BY last_name, first_name queries
CREATE INDEX idx_advocates_name_sort ON advocates (last_name, first_name);

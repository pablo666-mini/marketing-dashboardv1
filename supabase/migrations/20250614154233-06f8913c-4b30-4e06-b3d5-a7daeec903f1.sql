
-- Delete all existing social profiles
DELETE FROM social_profiles;

-- Insert new official Miniland social profiles
INSERT INTO social_profiles (id, name, handle, platform, active, created_at, updated_at) VALUES
-- Instagram profiles
(gen_random_uuid(), 'Miniland España', 'miniland_esp', 'Instagram', true, now(), now()),
(gen_random_uuid(), 'Miniland Dolls', 'minilanddolls', 'Instagram', true, now(), now()),
(gen_random_uuid(), 'Miniland Educational', 'miniland_educational_', 'Instagram', true, now(), now()),
(gen_random_uuid(), 'Miniland Profesional', 'miniland_profesional', 'Instagram', true, now(), now()),
(gen_random_uuid(), 'Miniland International', 'miniland_international', 'Instagram', false, now(), now()),
(gen_random_uuid(), 'Miniland USA', 'minilandusa', 'Instagram', true, now(), now()),
(gen_random_uuid(), 'Miniland Italia', 'miniland_italia', 'Instagram', true, now(), now()),
(gen_random_uuid(), 'Miniland France', 'miniland_france', 'Instagram', true, now(), now()),
(gen_random_uuid(), 'Miniland Dolls Australia', 'minilanddollsaus', 'Instagram', false, now(), now()),

-- TikTok profiles
(gen_random_uuid(), 'Miniland España TikTok', 'miniland_es', 'TikTok', true, now(), now()),
(gen_random_uuid(), 'Miniland USA TikTok', 'miniland_usa', 'TikTok', false, now(), now()),

-- LinkedIn profile
(gen_random_uuid(), 'Miniland Corporate', 'miniland', 'LinkedIn', true, now(), now()),

-- X (Twitter) profile
(gen_random_uuid(), 'Miniland España X', 'miniland_es', 'X', true, now(), now()),

-- Pinterest profile
(gen_random_uuid(), 'Miniland USA Pinterest', 'miniland_usa', 'Pinterest', true, now(), now()),

-- YouTube profiles
(gen_random_uuid(), 'Miniland Nacional', 'miniland_nacional', 'YouTube', true, now(), now()),
(gen_random_uuid(), 'Miniland International', 'miniland_international', 'YouTube', true, now(), now());

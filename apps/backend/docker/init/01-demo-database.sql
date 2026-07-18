\set ON_ERROR_STOP on

CREATE EXTENSION IF NOT EXISTS pgcrypto;

\i /docker-entrypoint-initdb.d/migrations/20250803045254_init/migration.sql
\i /docker-entrypoint-initdb.d/migrations/20250803091026_published/migration.sql
\i /docker-entrypoint-initdb.d/migrations/20251230042455_init/migration.sql
\i /docker-entrypoint-initdb.d/migrations/20260110113118_add_workspaces/migration.sql

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" VARCHAR(36) NOT NULL,
  "checksum" VARCHAR(64) NOT NULL,
  "finished_at" TIMESTAMPTZ,
  "migration_name" VARCHAR(255) NOT NULL,
  "logs" TEXT,
  "rolled_back_at" TIMESTAMPTZ,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "applied_steps_count" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

INSERT INTO "_prisma_migrations" (
  "id",
  "checksum",
  "finished_at",
  "migration_name",
  "started_at",
  "applied_steps_count"
) VALUES
  ('10000000-0000-4000-8000-000000000001', '2bdcffa951f4cb7719ce3fff804a1f554062e376e14b6c466735b3b3ea528383', now(), '20250803045254_init', now(), 1),
  ('10000000-0000-4000-8000-000000000002', '38ccf99b884286f2076b5761768ce18b8766e9d117887ce4a4966deba0b8f334', now(), '20250803091026_published', now(), 1),
  ('10000000-0000-4000-8000-000000000003', 'dc3dbd8ba4dadf7327735f1c2ed1b054ddc2df12d5888d3bd2b171ea45ce17c1', now(), '20251230042455_init', now(), 1),
  ('10000000-0000-4000-8000-000000000004', 'a1de96a22884cecbb8f31db1908fa5876424e374dd6d3716b29d97ad86412c9c', now(), '20260110113118_add_workspaces', now(), 1)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "users" (
  "id",
  "name",
  "email",
  "mobile",
  "password",
  "role",
  "isActive",
  "isEmailVerified",
  "isMobileVerified",
  "createdAt",
  "updatedAt"
) VALUES
  (
    '11111111-1111-4111-8111-111111111111',
    'Demo Admin',
    'admin@kite.test',
    '+15550000001',
    '$2b$12$H2JNQ9VlD0zJL7ZEa.rkLulxvES5fBvzeB57J8CBXORjv1GGqED3e',
    'ADMIN',
    true,
    true,
    true,
    now(),
    now()
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Demo User',
    'user@kite.test',
    '+15550000002',
    '$2b$12$H2JNQ9VlD0zJL7ZEa.rkLulxvES5fBvzeB57J8CBXORjv1GGqED3e',
    'USER',
    true,
    true,
    true,
    now(),
    now()
  )
ON CONFLICT ("email") DO UPDATE SET
  "name" = EXCLUDED."name",
  "mobile" = EXCLUDED."mobile",
  "password" = EXCLUDED."password",
  "role" = EXCLUDED."role",
  "isActive" = EXCLUDED."isActive",
  "isEmailVerified" = EXCLUDED."isEmailVerified",
  "isMobileVerified" = EXCLUDED."isMobileVerified",
  "updatedAt" = now();

INSERT INTO "workspaces" (
  "id",
  "name",
  "slug",
  "description",
  "ownerId",
  "isActive",
  "createdAt",
  "updatedAt"
) VALUES
  (
    '33333333-3333-4333-8333-333333333333',
    'Demo Admin Ops',
    'demo-admin-ops',
    'Admin workspace for reviewing users, posts, and org data.',
    '11111111-1111-4111-8111-111111111111',
    true,
    now(),
    now()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Acme Creative',
    'acme-creative-demo',
    'Primary demo org for the normal user.',
    '22222222-2222-4222-8222-222222222222',
    true,
    now(),
    now()
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Acme Events',
    'acme-events-demo',
    'Second demo org for workspace switching.',
    '22222222-2222-4222-8222-222222222222',
    true,
    now(),
    now()
  )
ON CONFLICT ("slug") DO UPDATE SET
  "name" = EXCLUDED."name",
  "description" = EXCLUDED."description",
  "ownerId" = EXCLUDED."ownerId",
  "isActive" = EXCLUDED."isActive",
  "updatedAt" = now();

INSERT INTO "workspace_members" (
  "id",
  "workspaceId",
  "userId",
  "role",
  "joinedAt",
  "updatedAt"
) VALUES
  (
    '66666666-6666-4666-8666-666666666666',
    '33333333-3333-4333-8333-333333333333',
    '11111111-1111-4111-8111-111111111111',
    'OWNER',
    now(),
    now()
  ),
  (
    '77777777-7777-4777-8777-777777777777',
    '44444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    'OWNER',
    now(),
    now()
  ),
  (
    '88888888-8888-4888-8888-888888888888',
    '55555555-5555-4555-8555-555555555555',
    '22222222-2222-4222-8222-222222222222',
    'OWNER',
    now(),
    now()
  )
ON CONFLICT ("workspaceId", "userId") DO UPDATE SET
  "role" = EXCLUDED."role",
  "updatedAt" = now();

INSERT INTO "user_profiles" (
  "id",
  "userId",
  "bio",
  "avatar",
  "metadata",
  "createdAt",
  "updatedAt"
) VALUES
  (
    '99999999-9999-4999-8999-999999999999',
    '11111111-1111-4111-8111-111111111111',
    'Demo administrator profile.',
    NULL,
    '{"role":"admin","location":"Demo City"}'::jsonb,
    now(),
    now()
  ),
  (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
    '22222222-2222-4222-8222-222222222222',
    'Demo user profile for testing the web app.',
    NULL,
    '{"role":"organiser","location":"Demo City","interests":["publishing","events","workspace management"]}'::jsonb,
    now(),
    now()
  )
ON CONFLICT ("userId") DO UPDATE SET
  "bio" = EXCLUDED."bio",
  "avatar" = EXCLUDED."avatar",
  "metadata" = EXCLUDED."metadata",
  "updatedAt" = now();

INSERT INTO "posts" (
  "id",
  "userId",
  "workspaceId",
  "title",
  "content",
  "status",
  "isActive",
  "publishedAt",
  "createdAt",
  "updatedAt"
) VALUES
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
    '22222222-2222-4222-8222-222222222222',
    '44444444-4444-4444-8444-444444444444',
    'Welcome to Acme Creative',
    'This is a seeded draft post for testing workspace-scoped writing and editing.',
    'DRAFT',
    true,
    NULL,
    now(),
    now()
  ),
  (
    'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
    '22222222-2222-4222-8222-222222222222',
    '44444444-4444-4444-8444-444444444444',
    'Spring Campaign Notes',
    'A published demo post with enough content to make lists, filters, and detail pages feel alive.',
    'PUBLISHED',
    true,
    '2026-01-15T10:00:00.000Z',
    now(),
    now()
  ),
  (
    'dddddddd-dddd-4ddd-8ddd-dddddddddddd',
    '22222222-2222-4222-8222-222222222222',
    '55555555-5555-4555-8555-555555555555',
    'Event Run of Show',
    'Seeded org data for testing a second workspace, workspace switching, and post filtering.',
    'PUBLISHED',
    true,
    '2026-02-20T12:00:00.000Z',
    now(),
    now()
  ),
  (
    'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',
    '11111111-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    'Admin Review Checklist',
    'A demo admin-owned post so the admin panel has content to inspect immediately.',
    'DRAFT',
    true,
    NULL,
    now(),
    now()
  )
ON CONFLICT ("id") DO UPDATE SET
  "userId" = EXCLUDED."userId",
  "workspaceId" = EXCLUDED."workspaceId",
  "title" = EXCLUDED."title",
  "content" = EXCLUDED."content",
  "status" = EXCLUDED."status",
  "isActive" = EXCLUDED."isActive",
  "publishedAt" = EXCLUDED."publishedAt",
  "updatedAt" = now();

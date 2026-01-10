/*
  Warnings:

  - Added the required column `workspaceId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WorkspaceMemberRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "workspaces" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "ownerId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_members" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "WorkspaceMemberRole" NOT NULL DEFAULT 'MEMBER',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workspace_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspaces_slug_key" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspaces_ownerId_idx" ON "workspaces"("ownerId");

-- CreateIndex
CREATE INDEX "workspaces_slug_idx" ON "workspaces"("slug");

-- CreateIndex
CREATE INDEX "workspace_members_workspaceId_idx" ON "workspace_members"("workspaceId");

-- CreateIndex
CREATE INDEX "workspace_members_userId_idx" ON "workspace_members"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_members_workspaceId_userId_key" ON "workspace_members"("workspaceId", "userId");

-- DATA MIGRATION: Create default workspaces for existing users
INSERT INTO workspaces (id, name, slug, "ownerId", description, "isActive", "createdAt", "updatedAt")
SELECT
  gen_random_uuid(),
  CONCAT(name, '''s Workspace'),
  CONCAT(LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]', '-', 'g')), '-', SUBSTRING(id, 1, 8)),
  id,
  'Your personal workspace',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM users
WHERE NOT EXISTS (
  SELECT 1 FROM workspaces WHERE "ownerId" = users.id
);

-- DATA MIGRATION: Create workspace members (owners) for all workspaces
INSERT INTO workspace_members (id, "workspaceId", "userId", role, "joinedAt", "updatedAt")
SELECT
  gen_random_uuid(),
  w.id,
  w."ownerId",
  'OWNER',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM workspaces w
WHERE NOT EXISTS (
  SELECT 1 FROM workspace_members
  WHERE "workspaceId" = w.id AND "userId" = w."ownerId"
);

-- AlterTable: Add workspaceId column (nullable first)
ALTER TABLE "posts" ADD COLUMN "workspaceId" TEXT;

-- DATA MIGRATION: Assign existing posts to user's default workspace
UPDATE posts p
SET "workspaceId" = w.id
FROM workspaces w
WHERE p."userId" = w."ownerId"
AND p."workspaceId" IS NULL;

-- AlterTable: Make workspaceId NOT NULL
ALTER TABLE "posts" ALTER COLUMN "workspaceId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "posts_workspaceId_idx" ON "posts"("workspaceId");

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

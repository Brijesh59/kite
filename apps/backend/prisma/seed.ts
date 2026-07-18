import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "DemoPass123!";

const demoIds = {
  adminUser: "11111111-1111-4111-8111-111111111111",
  normalUser: "22222222-2222-4222-8222-222222222222",
  adminWorkspace: "33333333-3333-4333-8333-333333333333",
  userWorkspace: "44444444-4444-4444-8444-444444444444",
  userEventsWorkspace: "55555555-5555-4555-8555-555555555555",
  adminWorkspaceMember: "66666666-6666-4666-8666-666666666666",
  userWorkspaceMember: "77777777-7777-4777-8777-777777777777",
  userEventsWorkspaceMember: "88888888-8888-4888-8888-888888888888",
  adminProfile: "99999999-9999-4999-8999-999999999999",
  userProfile: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
};

const demoPosts = [
  {
    id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
    userId: demoIds.normalUser,
    workspaceId: demoIds.userWorkspace,
    title: "Welcome to Acme Creative",
    content:
      "This is a seeded draft post for testing workspace-scoped writing and editing.",
    status: "DRAFT" as const,
    publishedAt: null,
  },
  {
    id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
    userId: demoIds.normalUser,
    workspaceId: demoIds.userWorkspace,
    title: "Spring Campaign Notes",
    content:
      "A published demo post with enough content to make lists, filters, and detail pages feel alive.",
    status: "PUBLISHED" as const,
    publishedAt: new Date("2026-01-15T10:00:00.000Z"),
  },
  {
    id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
    userId: demoIds.normalUser,
    workspaceId: demoIds.userEventsWorkspace,
    title: "Event Run of Show",
    content:
      "Seeded org data for testing a second workspace, workspace switching, and post filtering.",
    status: "PUBLISHED" as const,
    publishedAt: new Date("2026-02-20T12:00:00.000Z"),
  },
  {
    id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
    userId: demoIds.adminUser,
    workspaceId: demoIds.adminWorkspace,
    title: "Admin Review Checklist",
    content:
      "A demo admin-owned post so the admin panel has content to inspect immediately.",
    status: "DRAFT" as const,
    publishedAt: null,
  },
];

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  await prisma.$transaction(async (tx) => {
    await tx.user.upsert({
      where: { email: "admin@kite.test" },
      update: {
        name: "Demo Admin",
        mobile: "+15550000001",
        password: passwordHash,
        role: "ADMIN",
        isActive: true,
        isEmailVerified: true,
        isMobileVerified: true,
      },
      create: {
        id: demoIds.adminUser,
        name: "Demo Admin",
        email: "admin@kite.test",
        mobile: "+15550000001",
        password: passwordHash,
        role: "ADMIN",
        isActive: true,
        isEmailVerified: true,
        isMobileVerified: true,
      },
    });

    await tx.user.upsert({
      where: { email: "user@kite.test" },
      update: {
        name: "Demo User",
        mobile: "+15550000002",
        password: passwordHash,
        role: "USER",
        isActive: true,
        isEmailVerified: true,
        isMobileVerified: true,
      },
      create: {
        id: demoIds.normalUser,
        name: "Demo User",
        email: "user@kite.test",
        mobile: "+15550000002",
        password: passwordHash,
        role: "USER",
        isActive: true,
        isEmailVerified: true,
        isMobileVerified: true,
      },
    });

    await tx.workspace.upsert({
      where: { slug: "demo-admin-ops" },
      update: {
        name: "Demo Admin Ops",
        description: "Admin workspace for reviewing users, posts, and org data.",
        ownerId: demoIds.adminUser,
        isActive: true,
      },
      create: {
        id: demoIds.adminWorkspace,
        name: "Demo Admin Ops",
        slug: "demo-admin-ops",
        description: "Admin workspace for reviewing users, posts, and org data.",
        ownerId: demoIds.adminUser,
        isActive: true,
      },
    });

    await tx.workspace.upsert({
      where: { slug: "acme-creative-demo" },
      update: {
        name: "Acme Creative",
        description: "Primary demo org for the normal user.",
        ownerId: demoIds.normalUser,
        isActive: true,
      },
      create: {
        id: demoIds.userWorkspace,
        name: "Acme Creative",
        slug: "acme-creative-demo",
        description: "Primary demo org for the normal user.",
        ownerId: demoIds.normalUser,
        isActive: true,
      },
    });

    await tx.workspace.upsert({
      where: { slug: "acme-events-demo" },
      update: {
        name: "Acme Events",
        description: "Second demo org for workspace switching.",
        ownerId: demoIds.normalUser,
        isActive: true,
      },
      create: {
        id: demoIds.userEventsWorkspace,
        name: "Acme Events",
        slug: "acme-events-demo",
        description: "Second demo org for workspace switching.",
        ownerId: demoIds.normalUser,
        isActive: true,
      },
    });

    const memberships = [
      {
        id: demoIds.adminWorkspaceMember,
        workspaceId: demoIds.adminWorkspace,
        userId: demoIds.adminUser,
        role: "OWNER" as const,
      },
      {
        id: demoIds.userWorkspaceMember,
        workspaceId: demoIds.userWorkspace,
        userId: demoIds.normalUser,
        role: "OWNER" as const,
      },
      {
        id: demoIds.userEventsWorkspaceMember,
        workspaceId: demoIds.userEventsWorkspace,
        userId: demoIds.normalUser,
        role: "OWNER" as const,
      },
    ];

    for (const membership of memberships) {
      await tx.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: membership.workspaceId,
            userId: membership.userId,
          },
        },
        update: { role: membership.role },
        create: membership,
      });
    }

    await tx.userProfile.upsert({
      where: { userId: demoIds.adminUser },
      update: {
        bio: "Demo administrator profile.",
        avatar: null,
        metadata: { role: "admin", location: "Demo City" },
      },
      create: {
        id: demoIds.adminProfile,
        userId: demoIds.adminUser,
        bio: "Demo administrator profile.",
        avatar: null,
        metadata: { role: "admin", location: "Demo City" },
      },
    });

    await tx.userProfile.upsert({
      where: { userId: demoIds.normalUser },
      update: {
        bio: "Demo user profile for testing the web app.",
        avatar: null,
        metadata: {
          role: "organiser",
          location: "Demo City",
          interests: ["publishing", "events", "workspace management"],
        },
      },
      create: {
        id: demoIds.userProfile,
        userId: demoIds.normalUser,
        bio: "Demo user profile for testing the web app.",
        avatar: null,
        metadata: {
          role: "organiser",
          location: "Demo City",
          interests: ["publishing", "events", "workspace management"],
        },
      },
    });

    for (const post of demoPosts) {
      await tx.post.upsert({
        where: { id: post.id },
        update: {
          title: post.title,
          content: post.content,
          status: post.status,
          publishedAt: post.publishedAt,
          isActive: true,
          userId: post.userId,
          workspaceId: post.workspaceId,
        },
        create: {
          ...post,
          isActive: true,
        },
      });
    }
  });

  console.info("Seeded demo data:");
  console.info(`  Admin: admin@kite.test / ${DEMO_PASSWORD}`);
  console.info(`  User:  user@kite.test / ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error("Failed to seed demo data", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

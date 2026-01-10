import { PrismaClient } from "@prisma/client";
import type {
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  GetWorkspacesQuery,
  WorkspaceWithRole,
  PaginatedResponse,
  Workspace,
} from "@kite/types";
import { WORKSPACE_LIMITS, PAGINATION } from "@kite/config";
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "../../common/app-error";

export class WorkspaceService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createDefaultWorkspace(
    userId: string,
    userName: string
  ): Promise<Workspace> {
    const slug = await this.generateSlug(userName, userId);

    const workspace = await this.prisma.workspace.create({
      data: {
        name: `${userName}'s Workspace`,
        slug,
        description: "Your personal workspace",
        ownerId: userId,
      },
    });

    await this.prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    return this.formatWorkspace(workspace);
  }

  async getUserWorkspaces(
    userId: string,
    query: GetWorkspacesQuery
  ): Promise<PaginatedResponse<WorkspaceWithRole>> {
    const page = query.page || 1;
    const limit = Math.min(
      query.limit || PAGINATION.defaultLimit,
      PAGINATION.maxLimit
    );
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: query.isActive !== undefined ? query.isActive : true,
      members: {
        some: {
          userId,
        },
      },
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [workspaces, total] = await this.prisma.$transaction([
      this.prisma.workspace.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          members: {
            where: { userId },
            select: { role: true },
          },
          _count: {
            select: {
              members: true,
              posts: true,
            },
          },
        },
      }),
      this.prisma.workspace.count({ where }),
    ]);

    const items: WorkspaceWithRole[] = workspaces.map((workspace) => ({
      ...this.formatWorkspace(workspace),
      memberRole: workspace.members[0]?.role || "MEMBER",
    }));

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getWorkspaceById(id: string, userId: string): Promise<WorkspaceWithRole> {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        isActive: true,
        members: {
          some: { userId },
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        members: {
          where: { userId },
          select: { role: true },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found");
    }

    return {
      ...this.formatWorkspace(workspace),
      memberRole: workspace.members[0]?.role || "MEMBER",
    };
  }

  async createWorkspace(
    userId: string,
    data: CreateWorkspaceRequest
  ): Promise<Workspace> {
    // Check workspace limit
    const userWorkspaceCount = await this.prisma.workspaceMember.count({
      where: { userId },
    });

    if (userWorkspaceCount >= WORKSPACE_LIMITS.maxWorkspacesPerUser) {
      throw new BadRequestException(
        `You can only create up to ${WORKSPACE_LIMITS.maxWorkspacesPerUser} workspaces`
      );
    }

    const slug = await this.generateSlug(data.name, userId);

    const workspace = await this.prisma.workspace.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    await this.prisma.workspaceMember.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });

    return this.formatWorkspace(workspace);
  }

  async updateWorkspace(
    id: string,
    userId: string,
    data: UpdateWorkspaceRequest
  ): Promise<Workspace> {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        ownerId: userId,
        isActive: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found or you are not the owner");
    }

    let slug = workspace.slug;
    if (data.name && data.name !== workspace.name) {
      slug = await this.generateSlug(data.name, userId);
    }

    const updated = await this.prisma.workspace.update({
      where: { id },
      data: {
        name: data.name,
        slug,
        description: data.description,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    return this.formatWorkspace(updated);
  }

  async deleteWorkspace(id: string, userId: string): Promise<void> {
    const workspace = await this.prisma.workspace.findFirst({
      where: {
        id,
        ownerId: userId,
        isActive: true,
      },
    });

    if (!workspace) {
      throw new NotFoundException("Workspace not found or you are not the owner");
    }

    // Check if user has at least one other workspace
    const userWorkspaceCount = await this.prisma.workspaceMember.count({
      where: {
        userId,
        workspace: { isActive: true },
      },
    });

    if (userWorkspaceCount <= WORKSPACE_LIMITS.minWorkspacesPerUser) {
      throw new BadRequestException(
        "You must have at least one workspace. Cannot delete your last workspace."
      );
    }

    // Soft delete
    await this.prisma.workspace.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async checkWorkspaceMembership(
    workspaceId: string,
    userId: string
  ): Promise<boolean> {
    const member = await this.prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId,
        workspace: { isActive: true },
      },
    });

    return !!member;
  }

  private async generateSlug(name: string, userId: string): Promise<string> {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const userIdPart = userId.substring(0, 8);
    let slug = `${baseSlug}-${userIdPart}`;

    // Check uniqueness
    const existing = await this.prisma.workspace.findUnique({
      where: { slug },
    });

    if (existing) {
      const timestamp = Date.now().toString(36);
      slug = `${baseSlug}-${userIdPart}-${timestamp}`;
    }

    return slug;
  }

  private formatWorkspace(workspace: any): Workspace {
    return {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      description: workspace.description,
      ownerId: workspace.ownerId,
      isActive: workspace.isActive,
      createdAt: workspace.createdAt.toISOString(),
      updatedAt: workspace.updatedAt.toISOString(),
      owner: workspace.owner,
      _count: workspace._count,
    };
  }
}

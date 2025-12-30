import { PrismaClient } from "@prisma/client";
import {
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "../../common/app-error";
import {
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsQuery,
  POST_STATUS,
} from "./post.types";
import type { Post } from "@kite/types";
import { PAGINATION } from "@kite/config";

export class PostService {
  private prisma = new PrismaClient();

  /**
   * Create a new post (always starts as DRAFT)
   */
  async createPost(userId: string, data: CreatePostRequest): Promise<Post> {
    const post = await this.prisma.post.create({
      data: {
        userId,
        title: data.title,
        content: data.content,
        status: POST_STATUS.DRAFT,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return this.formatPost(post);
  }

  /**
   * Get user's own posts with pagination and filters
   */
  async getUserPosts(
    userId: string,
    query: GetPostsQuery = {}
  ): Promise<{
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || PAGINATION.defaultPage;
    const limit = Math.min(query.limit || PAGINATION.defaultLimit, PAGINATION.maxLimit);
    const skip = (page - 1) * limit;

    const where: any = {
      userId,
      isActive: true,
    };

    // Filter by status
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }

    // Search in title and content
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: posts.map(this.formatPost),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get all posts (admin only - will be used in admin module)
   */
  async getAllPosts(
    query: GetPostsQuery = {}
  ): Promise<{
    items: Post[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || PAGINATION.defaultPage;
    const limit = Math.min(query.limit || PAGINATION.defaultLimit, PAGINATION.maxLimit);
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    // Filter by user
    if (query.userId) {
      where.userId = query.userId;
    }

    // Filter by status
    if (query.status && query.status !== "ALL") {
      where.status = query.status;
    }

    // Search in title and content
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { content: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      this.prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: posts.map(this.formatPost),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get a single post by ID
   */
  async getPostById(id: string, userId: string): Promise<Post> {
    const post = await this.prisma.post.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException("Post not found");
    }

    return this.formatPost(post);
  }

  /**
   * Update a post
   */
  async updatePost(
    id: string,
    userId: string,
    data: UpdatePostRequest
  ): Promise<Post> {
    const existingPost = await this.prisma.post.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existingPost) {
      throw new NotFoundException("Post not found");
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return this.formatPost(updatedPost);
  }

  /**
   * Publish a post
   */
  async publishPost(id: string, userId: string): Promise<Post> {
    const existingPost = await this.prisma.post.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existingPost) {
      throw new NotFoundException("Post not found");
    }

    if (existingPost.status === POST_STATUS.PUBLISHED) {
      throw new BadRequestException("Post is already published");
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        status: POST_STATUS.PUBLISHED,
        publishedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return this.formatPost(updatedPost);
  }

  /**
   * Unpublish a post (revert to draft)
   */
  async unpublishPost(id: string, userId: string): Promise<Post> {
    const existingPost = await this.prisma.post.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existingPost) {
      throw new NotFoundException("Post not found");
    }

    if (existingPost.status === POST_STATUS.DRAFT) {
      throw new BadRequestException("Post is already in draft status");
    }

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        status: POST_STATUS.DRAFT,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return this.formatPost(updatedPost);
  }

  /**
   * Delete a post (soft delete)
   */
  async deletePost(id: string, userId: string): Promise<boolean> {
    const existingPost = await this.prisma.post.findFirst({
      where: {
        id,
        userId,
        isActive: true,
      },
    });

    if (!existingPost) {
      throw new NotFoundException("Post not found");
    }

    await this.prisma.post.update({
      where: { id },
      data: { isActive: false },
    });

    return true;
  }

  /**
   * Format post data to match shared types
   */
  private formatPost(post: any): Post {
    return {
      id: post.id,
      userId: post.userId,
      title: post.title,
      content: post.content,
      status: post.status,
      isActive: post.isActive,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      user: post.user ? {
        id: post.user.id,
        name: post.user.name,
        email: post.user.email,
        role: post.user.role,
        isActive: true,
        isEmailVerified: false,
        isMobileVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } : undefined,
    };
  }
}

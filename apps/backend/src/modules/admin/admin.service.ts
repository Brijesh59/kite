import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersQuery,
  UsersResponse,
  GetPostsQuery,
  PostsResponse,
  UpdatePostData,
  Post,
} from "./admin.types";
import { User } from "../auth/auth.types";

export class AdminService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Get all users with pagination and filtering
   */
  async getUsers(query: GetUsersQuery): Promise<UsersResponse> {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    // Build order by clause
    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    (orderBy as any)[sortBy] = sortOrder;

    // Get users and total count
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          mobile: true,
          role: true,
          isActive: true,
          isEmailVerified: true,
          isMobileVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      users: users as unknown as User[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        isMobileVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user as unknown as User;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserRequest): Promise<User> {
    const { name, email, mobile, password, role } = data;

    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(mobile ? [{ mobile }] : [])],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new Error("User with this email already exists");
      }
      if (existingUser.mobile === mobile) {
        throw new Error("User with this mobile number already exists");
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        mobile,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        isMobileVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user as unknown as User;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserRequest): Promise<User> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Check for duplicate email or mobile if being updated
    if (data.email || data.mobile) {
      const duplicateUser = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } }, // Exclude current user
            {
              OR: [
                ...(data.email ? [{ email: data.email }] : []),
                ...(data.mobile ? [{ mobile: data.mobile }] : []),
              ],
            },
          ],
        },
      });

      if (duplicateUser) {
        if (duplicateUser.email === data.email) {
          throw new Error("User with this email already exists");
        }
        if (duplicateUser.mobile === data.mobile) {
          throw new Error("User with this mobile number already exists");
        }
      }
    }

    // Update user
    const user = await this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        isMobileVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user as unknown as User;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<void> {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Prevent deleting the last admin
    if (existingUser.role === "ADMIN") {
      const adminCount = await this.prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        throw new Error("Cannot delete the last admin user");
      }
    }

    // Delete user
    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Get all posts with pagination and filtering
   */
  async getPosts(query: GetPostsQuery): Promise<PostsResponse> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      userId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PostWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    // Build order by clause
    const orderBy: Prisma.PostOrderByWithRelationInput = {};
    (orderBy as any)[sortBy] = sortOrder;

    // Get posts and total count
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.post.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      posts: posts as unknown as Post[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Update post (for admin operations like toggling status)
   */
  async updatePost(id: string, data: UpdatePostData): Promise<any> {
    // Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error("Post not found");
    }

    // Update post
    const post = await this.prisma.post.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return post;
  }

  /**
   * Delete post
   */
  async deletePost(id: string): Promise<void> {
    // Check if post exists
    const existingPost = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new Error("Post not found");
    }

    // Delete post
    await this.prisma.post.delete({
      where: { id },
    });
  }
}

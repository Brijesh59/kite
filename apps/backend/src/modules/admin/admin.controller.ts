import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { CatchAsyncClass } from "../../common/catch-async";
import {
  CreateUserRequest,
  UpdateUserRequest,
  GetUsersQuery,
  GetPostsQuery,
  UpdatePostData,
} from "./admin.types";

@CatchAsyncClass()
export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * Get all users with pagination and filtering
   */
  public async getUsers(req: Request, res: Response) {
    const query: GetUsersQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      role: req.query.role as any,
      sortBy: (req.query.sortBy as any) || "createdAt",
      sortOrder: (req.query.sortOrder as any) || "desc",
    };

    const result = await this.adminService.getUsers(query);

    res.status(200).json({
      message: "Users retrieved successfully",
      data: {
        users: result.users,
      },
      pagination: result.pagination,
    });
  }

  /**
   * Get user by ID
   */
  public async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await this.adminService.getUserById(id);

    res.status(200).json({
      message: "User retrieved successfully",
      data: {
        user,
      },
    });
  }

  /**
   * Create new user
   */
  public async createUser(req: Request, res: Response) {
    const userData: CreateUserRequest = req.body;

    const user = await this.adminService.createUser(userData);

    res.status(201).json({
      message: "User created successfully",
      data: {
        user,
      },
    });
  }

  /**
   * Update user
   */
  public async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const updateData: UpdateUserRequest = req.body;

    const user = await this.adminService.updateUser(id, updateData);

    res.status(200).json({
      message: "User updated successfully",
      data: {
        user,
      },
    });
  }

  /**
   * Delete user
   */
  public async deleteUser(req: Request, res: Response) {
    const { id } = req.params;

    await this.adminService.deleteUser(id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  }

  /**
   * Get all posts with pagination and filtering
   */
  public async getPosts(req: Request, res: Response) {
    const query: GetPostsQuery = {
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      search: req.query.search as string,
      status: req.query.status as any,
      userId: req.query.userId as string,
      sortBy: (req.query.sortBy as any) || "createdAt",
      sortOrder: (req.query.sortOrder as any) || "desc",
    };

    const result = await this.adminService.getPosts(query);

    res.status(200).json({
      message: "Posts retrieved successfully",
      data: {
        posts: result.posts,
      },
      pagination: result.pagination,
    });
  }

  /**
   * Update post
   */
  public async updatePost(req: Request, res: Response) {
    const { id } = req.params;
    const updateData: UpdatePostData = req.body;

    const post = await this.adminService.updatePost(id, updateData);

    res.status(200).json({
      message: "Post updated successfully",
      data: {
        post,
      },
    });
  }

  /**
   * Delete post
   */
  public async deletePost(req: Request, res: Response) {
    const { id } = req.params;

    await this.adminService.deletePost(id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  }
}

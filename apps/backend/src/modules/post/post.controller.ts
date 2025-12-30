import { Response } from "express";
import { PostService } from "./post.service";
import { CatchAsyncClass } from "../../common/catch-async";
import type { AuthRequest } from "../../common/types";
import {
  CreatePostRequest,
  UpdatePostRequest,
  GetPostsQuery,
} from "./post.types";

@CatchAsyncClass()
export class PostController {
  private postService: PostService;

  constructor() {
    this.postService = new PostService();
  }

  /**
   * Create a new post
   */
  async createPost(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const data: CreatePostRequest = req.body;

    const post = await this.postService.createPost(userId, data);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: { post },
    });
  }

  /**
   * Get user's own posts
   */
  async getUserPosts(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const query: GetPostsQuery = req.query;

    const result = await this.postService.getUserPosts(userId, query);

    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      data: result,
    });
  }

  /**
   * Get a single post by ID
   */
  async getPostById(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.id;

    const post = await this.postService.getPostById(postId, userId);

    res.status(200).json({
      success: true,
      message: "Post retrieved successfully",
      data: { post },
    });
  }

  /**
   * Update a post
   */
  async updatePost(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.id;
    const data: UpdatePostRequest = req.body;

    const post = await this.postService.updatePost(postId, userId, data);

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: { post },
    });
  }

  /**
   * Publish a post
   */
  async publishPost(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.id;

    const post = await this.postService.publishPost(postId, userId);

    res.status(200).json({
      success: true,
      message: "Post published successfully",
      data: { post },
    });
  }

  /**
   * Unpublish a post
   */
  async unpublishPost(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.id;

    const post = await this.postService.unpublishPost(postId, userId);

    res.status(200).json({
      success: true,
      message: "Post unpublished successfully",
      data: { post },
    });
  }

  /**
   * Delete a post
   */
  async deletePost(req: AuthRequest, res: Response) {
    const userId = req.user!.id;
    const postId = req.params.id;

    await this.postService.deletePost(postId, userId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: null,
    });
  }
}

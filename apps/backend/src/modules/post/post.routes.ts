import { Router, Express } from "express";
import { PostController } from "./post.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation";
import { postValidation } from "./post.validation";

const router = Router();
const postController = new PostController();

// All post routes require authentication
router.use(authMiddleware);

// Get current user's posts
router.get(
  "/",
  validate(postValidation.getAll),
  postController.getUserPosts.bind(postController)
);

// Create a new post
router.post(
  "/",
  validate(postValidation.create),
  postController.createPost.bind(postController)
);

// Get a single post by ID
router.get(
  "/:id",
  validate(postValidation.getById),
  postController.getPostById.bind(postController)
);

// Update a post
router.put(
  "/:id",
  validate(postValidation.update),
  postController.updatePost.bind(postController)
);

// Publish a post
router.post(
  "/:id/publish",
  validate(postValidation.publish),
  postController.publishPost.bind(postController)
);

// Unpublish a post
router.post(
  "/:id/unpublish",
  validate(postValidation.unpublish),
  postController.unpublishPost.bind(postController)
);

// Delete a post
router.delete(
  "/:id",
  validate(postValidation.delete),
  postController.deletePost.bind(postController)
);

export function setPostRoutes(app: Express) {
  app.use("/api/posts", router);
}

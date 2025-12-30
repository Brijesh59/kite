import { Router, Express } from "express";
import { AdminController } from "./admin.controller";
import { authMiddleware, requireAdmin } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation";
import {
  createUserValidation,
  updateUserValidation,
  userIdValidation,
  getUsersQueryValidation,
} from "./admin.validation";

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

// User management routes
router.get(
  "/users",
  // validate({ query: getUsersQueryValidation }),
  adminController.getUsers.bind(adminController)
);

router.get(
  "/users/:id",
  validate({ params: userIdValidation }),
  adminController.getUserById.bind(adminController)
);

router.post(
  "/users",
  validate({ body: createUserValidation }),
  adminController.createUser.bind(adminController)
);

router.put(
  "/users/:id",
  validate({ params: userIdValidation, body: updateUserValidation }),
  adminController.updateUser.bind(adminController)
);

router.delete(
  "/users/:id",
  validate({ params: userIdValidation }),
  adminController.deleteUser.bind(adminController)
);

// Post management routes
router.get("/posts", adminController.getPosts.bind(adminController));

router.put("/posts/:id", adminController.updatePost.bind(adminController));

router.delete("/posts/:id", adminController.deletePost.bind(adminController));

export function setAdminRoutes(app: Express) {
  app.use("/api/admin", router);
}

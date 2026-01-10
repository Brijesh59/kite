import { Router } from "express";
import { WorkspaceController } from "./workspace.controller";
import { authMiddleware } from "../../middleware/auth.middleware";

const router = Router();
const workspaceController = new WorkspaceController();

router.get(
  "/",
  authMiddleware,
  workspaceController.getWorkspaces.bind(workspaceController)
);

router.get(
  "/:id",
  authMiddleware,
  workspaceController.getWorkspaceById.bind(workspaceController)
);

router.post(
  "/",
  authMiddleware,
  workspaceController.createWorkspace.bind(workspaceController)
);

router.put(
  "/:id",
  authMiddleware,
  workspaceController.updateWorkspace.bind(workspaceController)
);

router.delete(
  "/:id",
  authMiddleware,
  workspaceController.deleteWorkspace.bind(workspaceController)
);

export default router;

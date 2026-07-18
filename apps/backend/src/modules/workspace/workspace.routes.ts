import { Router } from "express";
import { WorkspaceController } from "./workspace.controller";
import { authMiddleware } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validation";
import { workspaceValidation } from "./workspace.validation";

const router = Router();
const workspaceController = new WorkspaceController();

router.get(
  "/",
  authMiddleware,
  validate(workspaceValidation.getAll),
  workspaceController.getWorkspaces.bind(workspaceController)
);

router.get(
  "/:id",
  authMiddleware,
  validate(workspaceValidation.getById),
  workspaceController.getWorkspaceById.bind(workspaceController)
);

router.post(
  "/",
  authMiddleware,
  validate(workspaceValidation.create),
  workspaceController.createWorkspace.bind(workspaceController)
);

router.put(
  "/:id",
  authMiddleware,
  validate(workspaceValidation.update),
  workspaceController.updateWorkspace.bind(workspaceController)
);

router.delete(
  "/:id",
  authMiddleware,
  validate(workspaceValidation.delete),
  workspaceController.deleteWorkspace.bind(workspaceController)
);

export default router;

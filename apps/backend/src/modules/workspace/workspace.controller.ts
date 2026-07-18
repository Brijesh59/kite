import type { Response } from "express";
import { WorkspaceService } from "./workspace.service";
import { CatchAsyncClass } from "../../common/catch-async";
import { getRouteParam } from "../../common/route-params";
import type { CreateWorkspaceRequest, UpdateWorkspaceRequest, GetWorkspacesQuery } from "@kite/types";
import type { AuthRequest } from "../../common/types";

@CatchAsyncClass()
export class WorkspaceController {
  private workspaceService: WorkspaceService;

  constructor() {
    this.workspaceService = new WorkspaceService();
  }

  public async getWorkspaces(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const query: GetWorkspacesQuery = req.query;

    const result = await this.workspaceService.getUserWorkspaces(userId, query);

    res.status(200).json({
      success: true,
      message: "Workspaces retrieved successfully",
      data: result,
    });
  }

  public async getWorkspaceById(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const id = getRouteParam(req, "id");

    const workspace = await this.workspaceService.getWorkspaceById(id, userId);

    res.status(200).json({
      success: true,
      message: "Workspace retrieved successfully",
      data: workspace,
    });
  }

  public async createWorkspace(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const data: CreateWorkspaceRequest = req.body;

    const workspace = await this.workspaceService.createWorkspace(userId, data);

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  }

  public async updateWorkspace(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const id = getRouteParam(req, "id");
    const data: UpdateWorkspaceRequest = req.body;

    const workspace = await this.workspaceService.updateWorkspace(
      id,
      userId,
      data
    );

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: workspace,
    });
  }

  public async deleteWorkspace(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user!.id;
    const id = getRouteParam(req, "id");

    await this.workspaceService.deleteWorkspace(id, userId);

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
      data: null,
    });
  }
}

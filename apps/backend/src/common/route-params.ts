import type { Request } from "express";
import { BadRequestException } from "./app-error";

export function getRouteParam(req: Request, name: string): string {
  const value = req.params[name];

  if (!value || Array.isArray(value)) {
    throw new BadRequestException(`Invalid route parameter: ${name}`);
  }

  return value;
}

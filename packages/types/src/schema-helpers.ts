import { z } from "zod";

export const optionalBooleanQuerySchema = z.preprocess((value) => {
  if (value === undefined || value === "") {
    return undefined;
  }

  if (value === "true" || value === true) {
    return true;
  }

  if (value === "false" || value === false) {
    return false;
  }

  return value;
}, z.boolean().optional());

export const optionalIntegerQuerySchema = (max?: number) => {
  let schema = z.coerce.number().int().min(1);

  if (max) {
    schema = schema.max(max);
  }

  return z.preprocess((value) => {
    if (value === undefined || value === "") {
      return undefined;
    }

    return value;
  }, schema.optional());
};

export const uuidParamSchema = z.object({
  id: z.string().uuid("Invalid ID format"),
});

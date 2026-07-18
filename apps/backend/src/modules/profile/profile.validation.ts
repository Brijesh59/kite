import { updateProfileRequestSchema } from "@kite/types";

export const profileValidation = {
  submit: {
    body: updateProfileRequestSchema,
  },
};

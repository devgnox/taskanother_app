import { Source } from "@prisma/client";
import { optional, z } from "zod";

export const UpdateChecklist = z.object({
  id: z.string(),
  boardId: z.string(),
  tasks: z.optional(
    z
      .string({
        required_error: "Task must have a title.",
        invalid_type_error: "Task is required",
      })
      .min(2, { message: "Task title too short." })
  ),
});

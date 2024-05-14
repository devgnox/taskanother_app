import { Source } from "@prisma/client";
import { optional, z } from "zod";

export const UpdateCard = z.object({
  id: z.string(),
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(3, { message: "Title is too short." })
  ),
  boardId: z.string(),
  description: z.optional(
    z
      .string({
        required_error: "Description is required",
        invalid_type_error: "Description is required",
      })
      .min(2, { message: "Descrition is too short." })
  ),
  tasks: z.optional(
    z
      .string({
        required_error: "Task must have a title.",
        invalid_type_error: "Task is required",
      })
      .min(2, { message: "Task title too short." })
  ),
  dueDate:
    z.
    optional(
      z.date({
          required_error: "Due Date is Required.",
          invalid_type_error: "Due Date formatt is wrong.",
        }).min(new Date(),{message:"Date cannot be earlier than today."})
    ),
  links: z
    .object({
      source: z.nativeEnum(Source),
      url: z.string().url({ message: "Invalid URL" }),
    })
    .array()
    .optional(),
  images: z
    .object({
      url: z.string().url({ message: "No file uploaded." }),
      title: z.optional(z.string().min(1, { message: "Title is too short." })),
    }).array()
    .optional(),
  collaborators: z.string().array().optional(),
  completed:z.boolean().optional(),
});

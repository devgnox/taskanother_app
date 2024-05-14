import { z } from "zod";

export const UpdateBoardImage = z.object({
    id: z.string(),
    image: z.string({
      required_error: "Images is required",
      invalid_type_error: "Image is required",
    }),
});

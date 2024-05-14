import { z } from "zod";

export const DeleteImage = z.object({
  id: z.string(),
  cardId: z.string(),
  boardId:z.string(),
});

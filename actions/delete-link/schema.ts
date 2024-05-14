import { z } from "zod";

export const DeleteLink = z.object({
  id: z.string(),
  cardId: z.string(),
  boardId:z.string(),
});

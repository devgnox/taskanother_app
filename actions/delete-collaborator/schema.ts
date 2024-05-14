import { z } from "zod";

export const DeleteCollaborator = z.object({
  id: z.string(),
  cardId:z.string(),
  boardId: z.string(),
});

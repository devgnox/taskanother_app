"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCollaborator } from "./schema";
import { ACTION, ENTITY_TYPE, Prisma } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, boardId, cardId } = data;

  if (!id || !boardId) {
    return { error: "Missing fields. Failed to delete Board." };
  }

  let card;
  let userIds;
  try {
    userIds = await db.card.findFirst({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      select: { collaborators: true},
    });

    card = await db.card.update({
      where: {
        id: cardId,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        collaborators: userIds?.collaborators.filter((user)=>user!==id),
      },
      include:{
        images:true,
        links:true,
      }
    });
  } catch (error) {
    return { error: "Failed to Delete" };
  }

  await createAuditLog({entityId:card.id, entityTitle:card.title,entityType:ENTITY_TYPE.CARD, action:ACTION.UPDATE });


  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCollaborator = createSafeAction(DeleteCollaborator, handler);

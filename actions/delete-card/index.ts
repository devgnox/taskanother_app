"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
import { ACTION, ENTITY_TYPE, Prisma } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, boardId } = data;

  if (!id || !boardId) {
    return { error: "Missing fields. Failed to delete Board." };
  }

  let card;

  try {
   
    card = await db.card.delete({
      where:{
        id, list:{
          board:{
            orgId
          }
        }
      }
    });

    await createAuditLog({entityId:card.id, entityTitle:card.title,entityType:ENTITY_TYPE.CARD, action:ACTION.DELETE });

  } catch (error) {
    return { error: "Failed to Delete" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCard, handler);

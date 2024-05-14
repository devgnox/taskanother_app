"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, listId, boardId } = data;

  if (!title || !boardId || !listId) {
    return { error: "Missing fields. Failed to create Card." };
  }

  let card;

  try {
    const list = await db.list.findUnique({ where: { id: listId, boardId, board:{orgId} } });
    if (!list) return { error: "List not Flound" };

    const lastCard = await db.card.findFirst({
      where: { listId},
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        title,
        listId,
        userId,
        order:newOrder,
        completed:false,
      },include:{
        images:true,
        links:true
      }
    });

    await createAuditLog({entityId:card.id, entityTitle:card.title,entityType:ENTITY_TYPE.CARD, action:ACTION.CREATE });
  } catch (error) {
    return { error: "Failed to Create" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const createCard = createSafeAction(CreateCard, handler);

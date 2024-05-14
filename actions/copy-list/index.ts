"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";
import { ACTION, ENTITY_TYPE, Prisma } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, boardId } = data;

  if (!id || !boardId) {
    return { error: "Missing fields. Failed to delete Board." };
  }

  let list;

  try {
    let listToCopy = await db.list.findUnique({
      where: { id, boardId, board: { orgId } },
      include: { cards:{include:{images:true, links:true}} }
    });

    if (!listToCopy) return { error: "List not found" };

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 1;

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} - Copy`,
        order: newOrder,
        userId:listToCopy.userId,
        cards: {
          createMany: {
            data: listToCopy.cards.map((card) => ({
              title: card.title,
              description: card.description,
              userId:card.userId,
              order: card.order,
              
              tasks:card.tasks,
              collaborators:card.collaborators,
            })),
          },
        },
      },
      include:{
        cards:true
      }
    });

    await createAuditLog({entityId:list.id, entityTitle:list.title,entityType:ENTITY_TYPE.LIST, action:ACTION.CREATE });


  } catch (error) {
    console.log(error);
    
    return { error: "Failed to Copy" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);

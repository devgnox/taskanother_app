"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, id, boardId } = data;

  if (!title || !id || !boardId) {
    return { error: "Missing fields. Failed to update Board." };
  }

  let list;

  try {
    const board = await db.board.findUnique({ where: { id: boardId, orgId } });
    if (!board) return { error: "Board not Flound" };

    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });

  await createAuditLog({entityId:list.id, entityTitle:list.title,entityType:ENTITY_TYPE.LIST, action:ACTION.UPDATE });

  } catch (error) {
    return { error: "Failed to Update" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);

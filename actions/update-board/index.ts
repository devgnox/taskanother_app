"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};


const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { title, id } = data;

  if (!title || !id) {
    return { error: "Missing fields. Failed to update Board." };
  }

  let board;

  try {
    board = await db.board.update({ where:{id, orgId},
      data: {
        title,
      },
    });

  await createAuditLog({entityId:board.id, entityTitle:board.title,entityType:ENTITY_TYPE.BOARD, action:ACTION.UPDATE });

  } catch (error) {
    return { error: "Failed to Update" };
  }

  revalidatePath(`/board/${id}`);
  return { data: board };

}

export const updateBoard = createSafeAction(UpdateBoard, handler);

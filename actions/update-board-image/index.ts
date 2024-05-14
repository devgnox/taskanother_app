"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateBoardImage } from "./schema";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};


const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, image } = data;

  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] = image.split("|");

  if (!imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName || !id) {
    return { error: "Missing fields. Failed to update Board." };
  }
    
  let board;

  try {
    board = await db.board.update({ where:{id, orgId},
      data: {
        imageFullUrl:imageFullUrl,
        imageId:imageId,
        imageLinkHTML:imageLinkHTML,
        imageThumbUrl:imageThumbUrl,
        imageUserName:imageUserName
      },
    });

    await createAuditLog({entityId:board.id, entityTitle:board.title,entityType:ENTITY_TYPE.BOARD, action:ACTION.UPDATE });

  } catch (error) {
    return { error: "Failed to Update" };
  }

  revalidatePath(`/board/${id}`);
  return { data: board };

}

export const updateBoardImage = createSafeAction(UpdateBoardImage, handler);

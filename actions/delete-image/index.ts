"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteImage } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, cardId, boardId } = data;

  if (!id || !cardId || !boardId ) {
    return { error: "Missing fields. Failed to delete." };
  }

  let image;

  try {
    image = await db.imageCard.delete({ where: { id, card:{
      id:cardId
    }} });
  } catch (error) {
    return { error: "Failed to Delete" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: image };
};

export const deleteImage = createSafeAction(DeleteImage, handler);

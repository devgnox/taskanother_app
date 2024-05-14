"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteLink } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  if (!userId || !orgId) return { error: "Unauthorized" };

  const { id, cardId, boardId } = data;

  if (!id || !cardId || !boardId) {
    return { error: "Missing fields. Failed to delete Board." };
  }

  let link;

  try {
    link = await db.link.delete({ where: { id, card:{
      id:cardId
    }} });
  } catch (error) {
    return { error: "Failed to Delete" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: link };
};

export const deleteLink = createSafeAction(DeleteLink, handler);

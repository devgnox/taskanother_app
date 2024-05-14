"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";
import { decreaseAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();
  const isPro = await checkSubscription();

  if (!userId || !orgId) return { error: "Unauthorized" };
  
  const { id } = data;
  
  let board;

  if (!id) {
    return { error: "Missing fields. Failed to delete Board." };
  }

  try {
   board= await db.board.delete({ where: { id, orgId } });

   if(!isPro) await decreaseAvailableCount();
   
    await createAuditLog({entityId:board.id, entityTitle:board.title,entityType:ENTITY_TYPE.BOARD, action:ACTION.DELETE });

  } catch (error) {
    return { error: "Failed to Delete" };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);

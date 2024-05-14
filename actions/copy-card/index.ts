"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { ACTION, ENTITY_TYPE, Link, Prisma } from "@prisma/client";
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
    let cardToCopy = await db.card.findUnique({
      where: { id, list: { board: { orgId } } },
      include: { images: true, links: true },
    });

    if (!cardToCopy) return { error: "Card not found" };

    const lastCard = await db.card.findFirst({
      where: { id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1;

    card = await db.card.create({
      data: {
        listId: cardToCopy.listId,
        title: `${cardToCopy.title} - Copy`,
        order: newOrder,
        userId: cardToCopy.userId,
        collaborators: cardToCopy.collaborators,
        description: cardToCopy.description,
        tasks:cardToCopy.tasks,
        dueDate:cardToCopy.dueDate,
        completed:cardToCopy.completed,
        images: {
          createMany: {
            data: cardToCopy.images.map((img) => ({
              title: img.title,
              url: img.url,
            })),
          },
        },
        links: {
          createMany: {
            data: cardToCopy.links.map((link:Link) => ({
              source: link.source,
              url: link.url,
            })),
          },
        },
      },
      include: {
        images: true,
        links: true,
      },
    });
    await createAuditLog({entityId:card.id, entityTitle:card.title,entityType:ENTITY_TYPE.CARD, action:ACTION.CREATE });

  } catch (error) {
    console.log(error);
    return { error: "Failed to Copy" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCard, handler);

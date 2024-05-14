"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";
import { ACTION, ENTITY_TYPE, Source } from "@prisma/client";
import { connect } from "http2";
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

  const { id, boardId, links, images, ...values } = data;

  let card;

  try {
    if (links && links.length > 0) {
      await db.link.createMany({
        data: links.map((link) => ({
          url: link.url,
          source: link.source,
          cardId: id,
        })),
      });
    }

    if (images && images.length > 0) {
      await db.imageCard.createMany({
        data: images.map((img) => ({
          url: img.url,
          title:img.title!,
          cardId: id,
        })),
      });
    }

    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        ...values,
      },
      include: {
        links: true,
        images: true,
      },
    });

  await createAuditLog({entityId:card.id, entityTitle:card.title,entityType:ENTITY_TYPE.CARD, action:ACTION.UPDATE });

  } catch (error) {
    return { error: "Failed to Update" };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const updateCard = createSafeAction(UpdateCard, handler);

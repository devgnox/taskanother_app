"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList, UserClerk } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import CardHeader from "./CardHeader";
import { User } from "@clerk/nextjs/server";
import CardContent from "./CardContent";
import CardAttachment from "./CardAttachment";
import { AuditLog, ImageCard, Link } from "@prisma/client";
import Actions from "./Actions";
import { useParams } from "next/navigation";
import CardCheckList from "./CardCheckList";
import Activity from "./Activity";

export const CardModal = () => {
  const params = useParams();
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher({ url: `/api/cards/${id}` }),
  });
  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher({ url: `/api/cards/${id}/logs` }),
  });
  const { data: usersOnTeam } = useQuery<UserClerk[]>({
    queryKey: ["users"],
    queryFn: () => fetcher({ url: `/api/users/board/${params.boardId}` }),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="lg:h-[90%]">
        {!cardData ? (
          <CardHeader.Skeleton />
        ) : (
          <CardHeader data={cardData} users={usersOnTeam} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 overflow-y-auto overflow-x-hidden">
          <div className="col-span-3 mb-1 ">
            <div className="w-full space-y-6">
              {!cardData ? (
                <CardContent.Skeleton />
              ) : (
                <CardContent data={cardData} />
              )}
            </div>
          </div>
          {!cardData ? (
            <Actions.Skeleton />
          ) : (
            <Actions data={cardData} users={usersOnTeam} />
          )}

          <div className="col-span-3 mb-1 ">
            <div className="w-full space-y-6">
              {!cardData ? (
                <CardCheckList.Skeleton />
              ) : (
                <CardCheckList
                  data={cardData.tasks || "[]"}
                  cardId={cardData.id}
                />
              )}
            </div>
          </div>

          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <CardAttachment.Skeleton />
              ) : (
                <CardAttachment
                  cardId={cardData.id}
                  links={cardData.links}
                  images={cardData.images}
                />
              )}
            </div>
          </div>
          <div className="col-span-3">
            <div className="w-full space-y-1">
            {!auditLogsData ? (
                <Activity.Skeleton />
              ) : (
                <Activity
                  items={auditLogsData}
                />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

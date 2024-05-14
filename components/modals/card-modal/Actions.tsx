"use client";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList, UserClerk } from "@/types";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Trash, Users } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import CardAssignUser from "./CardAssignUser";
import { fetcher } from "@/lib/fetcher";

interface IActionsProps {
  data: CardWithList;
  users:UserClerk[] | undefined;
}

const Actions = ({ data, users }: IActionsProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const cardModal = useCardModal();

  const { execute: executeCopy, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card '${data.title}' Copied.`);
        cardModal.onClose();
        // queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const { execute: executeDelete, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card '${data.title}' Deleted.`);
        cardModal.onClose();

        // queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const onCopy = () => {
    const boardId = params.boardId as string;
    executeCopy({ id: data.id, boardId });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;
    executeDelete({ id: data.id, boardId });
  };

  return (
    <div className="space-y-2 mt-2 mb-3 md:mb-2 flex-col md:flex-row sm:flex-row md:gap-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-auto md:w-full mr-2 justify-start "
        size="inline"
      >
        <Copy className="w-4 h-4 mr-2" /> Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-auto  md:w-full mr-2 justify-start"
        size="inline"
      >
        <Trash className="w-4 h-4 mr-2" /> Delete
      </Button>
      <CardAssignUser
        cardId={data.id}
        collaborators={data.collaborators} usersOnTeam={users}
      />
    </div>
  );
};

export default Actions;

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};

"use client";

import { deleteLink } from "@/actions/delete-link";
import FormSubmit from "@/components/form/FormSubmit";
import { useAction } from "@/hooks/use-action";
import { Source } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link2, Trash } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ICardLinkItem {
  id: string;
  url: string;
  source: Source;
  cardId: string;
}
const CardLinkItem = ({ id, url, source, cardId }: ICardLinkItem) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);

  const { execute: executeDeleteLink } = useAction(deleteLink, {
    onSuccess: (data) => {
      toast.success("Link Deleted.");
      queryClient.invalidateQueries({ queryKey: ["links", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDeleteLink = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = params.boardId as string;

    executeDeleteLink({ cardId, boardId, id });
  };

  return (
    <>
      <div
        key={id}
        className=" rounded-sm  group w-auto flex items-center gap-2"
      >
        <Link2 height={16} width={16} className="" />
        <Link
          href={url}
          className="font-semibold w-[75%] flex items-center justify-start rounded-md p-1 pl-1.5 truncate bg-neutral-200 hover:bg-neutral-200/50"
          target="_blank"
        >
          <span className="capitalize mr-1 w-full truncate">
            {source} |<span className="lowercase ml-1 truncate ">{url}</span>
          </span>
        </Link>
        <form action={onDeleteLink} ref={formRef}>
          <input type="hidden" name="id" id="id" value={id} />
          <FormSubmit
            className="w-[26px] h-[26px] aspect-square items-center"
            variant="outline"
            size="icon"
          >
            <Trash size={15} className=" text-neutral-800" />
          </FormSubmit>
        </form>
      </div>
    </>
  );
};

export default CardLinkItem;

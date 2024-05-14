"use client";

import { deleteImage } from "@/actions/delete-image";
import { deleteLink } from "@/actions/delete-link";
import FormSubmit from "@/components/form/FormSubmit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Source } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Fullscreen, ImageIcon, Link2, Trash, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface ICardImageItemProps {
  id: string;
  url: string;
  cardId: string;
  index: number;
  title: string;
}
const CardImageItem = ({
  id,
  url,
  cardId,
  title,
  index,
}: ICardImageItemProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);

  const { execute: executeDeleteImage } = useAction(deleteImage, {
    onSuccess: (data) => {
      toast.success("Image Deleted.");
      queryClient.invalidateQueries({ queryKey: ["images", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDeleteImage = (formData: FormData) => {
    const boardId = params.boardId as string;

    executeDeleteImage({ cardId, boardId, id });
  };

  return (
    <>
      {index > 2 ? (
        <div className="w-full group overflow-hidden relative rounded-sm shadow-sm transition flex items-center gap-2">
          <ImageIcon height={16} width={16} className="" />
          <Link
            href={url}
            target="_blank"
            className="font-medium text-xs w-[150px] p-[0.10rem] px-1.5 pl-2 truncate bg-neutral-200 hover:bg-neutral-200/50"
          >
            {title}
          </Link>
          <Button
            size="icon"
            className="w-[20px] h-[20px] rounded-sm border-none bg-destructive/50 transition hover:bg-destructive  "
          >
            <Trash className="w-3 h-3 text-neutral-100 hover:text-white" />
          </Button>
        </div>
      ) : (
        <div className="aspect-video group mb-1 overflow-hidden relative rounded-sm shadow-sm transition bg-neutral-300/30  w-[110px] ">
          <Image
            src={url}
            fill
            alt="attachment"
            className="object-cover group-hover:opacity-85 transition"
          />
          <div className="absolute z-[1] bottom-0 h-5 bg-neutral-400/70 transition flex items-start p-1 w-full group-hover:bg-neutral-900/40">
            <p className=" text-xs  truncate  text-white">{title}</p>
          </div>

          <Link
            href={url}
            target="_blank"
            className="absolute z-10 rounded-sm right-0 p-1 bg-neutral-400/50 text-neutral-700 hover:text-white transition hover:bg-gray-900  "
          >
            <Fullscreen className="w-3 h-3 " />
          </Link>
          <form action={onDeleteImage} ref={formRef}>
            <FormSubmit
              className="w-[20px] z-10 h-[20px] absolute rounded-sm border-none right-0 bottom-0 bg-destructive/50 transition hover:bg-destructive"
              variant="outline"
              size="icon"
            >
              <Trash className="w-3 h-3 text-neutral-100 hover:text-white" />
            </FormSubmit>
          </form>
        </div>
      )}
    </>
  );
};

export default CardImageItem;

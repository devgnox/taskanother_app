"use client";

import { updateBoardImage } from "@/actions/update-board-image";
import FormPicker from "@/components/form/FormPicker";
import FormSubmit from "@/components/form/FormSubmit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import { useParams, useRouter } from "next/navigation";
import React, { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface IBoardChangeBgProps {
  boardTitle: string;
}

const BoardChangeBg = ({ boardTitle }: IBoardChangeBgProps) => {
  const router = useRouter();
  const params = useParams();
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute, fieldErrors } = useAction(updateBoardImage, {
    onSuccess: (data) => {
      toast.success(`Board '${data.title}' background changed.`);
      closeRef.current?.click();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const image = formData.get("image") as string;
    const boardId = params.boardId as string;

    execute({ image, id: boardId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Change Background
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Board Background</DialogTitle>
        </DialogHeader>
        <form action={onSubmit}>
          <div className="flex flex-col w-full items-start space-x-2">
            <div className="mb-2 w-full">
              <FormPicker id="image" errors={fieldErrors} />
            </div>
            <div className="flex gap-2 justify-end w-full">
              <DialogClose asChild ref={closeRef}>
                <Button type="button" variant="ghost">
                  Close
                </Button>
              </DialogClose>
              <FormSubmit className="" variant="primary">
                Save
              </FormSubmit>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BoardChangeBg;

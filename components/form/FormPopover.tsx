"use client";

import React, { ElementRef, useRef } from "react";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { FormInput } from "@/components/form/FormInput";
import FormSubmit from "./FormSubmit";
import { toast } from "sonner";
import FormPicker from "./FormPicker";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";

interface IFormPopoverProps {
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}
const FormPopover = ({
  children,
  side = "bottom",
  align,
  sideOffset = 0,
}: IFormPopoverProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);
  const router=useRouter();
   const proModal= useProModal();

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success(`Board '${data.title}' Created`);
      closeRef.current?.click();
      router.push(`/board/${data.id}`)
    },
    onError: (error) => {
      toast.error(error);
      proModal.onOpen();
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    execute({ title, image });
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent
          align={align}
          className="w-80 pt-3 "
          side={side}
          sideOffset={sideOffset}
        >
          <div className="text-sm font-medium text-center text-neutral-600 pb-4 ">
            Create Board
          </div>
          <PopoverClose asChild ref={closeRef}>
            <Button
              className="h-auto w-auto absolute text-neutral-600 right-2 top-2"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </PopoverClose>
          <form action={onSubmit} className="space-y-4">
            <div className="space-y-4">
              <FormPicker id="image" errors={fieldErrors} />
              <FormInput
                id="title"
                label="Board Title"
                type="text"
                errors={fieldErrors}
              />
            </div>
            <FormSubmit className="w-full" variant="primary">
              Create
            </FormSubmit>
          </form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FormPopover;

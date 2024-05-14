"use client";
import React, {
  ElementRef,
  forwardRef,
  KeyboardEventHandler,
  useRef,
} from "react";
import { createCard } from "@/actions/create-card";
import FormSubmit from "@/components/form/FormSubmit";
import FormTextarea from "@/components/form/FormTextarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useParams } from "next/navigation";

interface ICardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

const CardForm = forwardRef<HTMLTextAreaElement, ICardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const formRef = useRef<ElementRef<"form">>(null);
    const params = useParams();

    const { execute: executeCreate, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card '${data.title}' created`);
        formRef.current?.reset();
      },
      onError: (error) => {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);
    useEventListener("keydown", onKeyDown);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardid = params.boardId as string;

      executeCreate({ title, listId, boardId: boardid });

      disableEditing();
    };

    if (isEditing) {
      return (
        <form
          action={onSubmit}
          ref={formRef}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeydown={onTextareaKeyDown}
            ref={ref}
            errors={fieldErrors}
            placeholder="Enter a title for this card..."
          />
          <input hidden name="listId" id="listId" value={listId} />

          <div className="flex items-center  gap-x-1 mt-1">
            <FormSubmit>Add Card</FormSubmit>
            <Button size="sm" onClick={disableEditing} variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          className="w-full py-1.5 px-2 h-auto justify-start text-muted-foreground text-sm "
          size="sm"
          variant="ghost"
          onClick={enableEditing}
        >
          <Plus className="h-4 w-4 mr-2" /> Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";

export default CardForm;

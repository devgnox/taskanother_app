"use client";
import { updateCard } from "@/actions/update-card";
import FormErrors from "@/components/form/FormErrors";
import { FormInput } from "@/components/form/FormInput";
import FormSubmit from "@/components/form/FormSubmit";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAction } from "@/hooks/use-action";
import { Link, Source } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { FilePlus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ILinkAttachmentProps {
  cardId: string;
}

const LinkAttachment = ({ cardId }: ILinkAttachmentProps) => {
  const params = useParams();
  const closeRef = useRef<ElementRef<"button">>(null);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isMounted, setIsMounted] = useState(false);

  const queryClient = useQueryClient();

  const [source, setSource] = useState("other");

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      toast.success("Link Added.");
      queryClient.invalidateQueries({ queryKey: ["link", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      closeRef?.current?.click();
      formRef.current?.reset();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onSubmit = (formData: FormData) => {
    const link = formData.get("links") as string;
    const site = source as Source;
    const boardId = params.boardId as string;

    execute({ links: [{ url: link, source: site }], boardId, id: cardId });
  };

  
  if (!isMounted) {
    return null;
  }
  

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button title="Add Link" variant="ghost" className="h-[25px] w-[25px]" size="icon">
          <FilePlus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 pt-3 pb-3 w-[350px]"
        side="right"
        align="start"
      >
        <div
          className="text-sm
       font-medium text-center text-neutral-600 pb-4"
        >
          Add Link
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className="absolute top-2 right-2 h-auto w-auto p-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <div className="px-3 py-2 w-full">
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <div className="flex gap-1 justify-between items-center">
              <input hidden name="cardId" id="cardId" defaultValue={cardId} />
              <div className="space-y-2">
                <Label
                  htmlFor="source"
                  className="text-xs font-semibold text-neutral-700"
                >
                  Source
                </Label>
                <Select value={source} onValueChange={setSource}>
                  <SelectTrigger className="w-[100px] h-[28px]" id="source">
                    <SelectValue aria-label={source}>
                      <span className="capitalize">{source}</span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="figma">Figma</SelectItem>
                    <SelectItem value="github">Github</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="youtube">Youtube</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <FormInput
                type="text"
                className=""
                ref={inputRef}
                placeholder="Enter Url"
                id="links"
                label="Link"
              />
            </div>
             <FormErrors id="links" errors={fieldErrors} />
            <div className="flex justify-end">
              <FormSubmit
                variant="ghost"
                className="rounded-none w-[70px] h-auto p-2 px-5 justify-start self-end font-normal text-sm mt-4"
              >
                Add
              </FormSubmit>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkAttachment;

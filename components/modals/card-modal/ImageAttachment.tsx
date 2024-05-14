"use client";
import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface IImageAttachmentProps {
  cardId: string;
}

const ImageAttachment = ({ cardId }: IImageAttachmentProps) => {
  const params = useParams();
  const closeRef = useRef<ElementRef<"button">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const titleRef = useRef<ElementRef<"input">>(null);

  const queryClient = useQueryClient();
  const [urlValue, setUrlValue] = useState("");
  const [isPending, setIsPending] = useState(false);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      toast.success("Image Added.");
      queryClient.invalidateQueries({ queryKey: ["images", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      
      closeRef?.current?.click();
      titleRef.current?.blur();
      inputRef.current?.blur();

      setIsPending(false);
    },
    onError: (error) => {
      toast.error(error);
      setIsPending(false);
    },
  });

  const handleUploadOwnImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault()

    setIsPending(true);
    let files: FileList | null = e?.currentTarget?.files;
    if (!files) return toast.error("couldn't upload image");
    
    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("upload_preset", "dlxrvlud");

    fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        
        setIsPending(false);
        setUrlValue(prevUrl=>data?.url);
        onSubmit();
      });
  };

  const onSubmit = () => {
    if(!urlValue) return;

    const titleData=titleRef.current?.value || '';
    const boardId = params.boardId as string;

    execute({ images: [{ url: urlValue, title:titleData }], boardId, id: cardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          title="Add Image"
          variant="ghost"
          className="h-[25px] w-[25px]"
          size="icon"
        >
          <ImagePlus className="h-4 w-4" />
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
          Add Image
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
            <div className="flex gap-1 justify-between items-center">
              <div className="w-full">
                <input
                  hidden
                  name="url"
                  id="url"
                  defaultValue={urlValue}
                  ref={inputRef}
                />
                <div className="mb-2">
                  <FormInput
                    ref={titleRef}
                    id="images"
                    label="Title"
                    type="text"
                    errors={fieldErrors} required
                  />
                </div>
                <Input id="imageUploader" type="file" onChange={handleUploadOwnImage} />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={onSubmit} disabled={isPending}
                variant="ghost"
                className="rounded-none w-[70px] h-auto p-2 px-5 justify-start self-end font-normal text-sm mt-4"
              >
                Add
              </Button>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImageAttachment;

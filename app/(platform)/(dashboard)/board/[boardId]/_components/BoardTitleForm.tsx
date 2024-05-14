"use client";
import { updateBoard } from "@/actions/update-board";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { db } from "@/lib/db";
import { Board } from "@prisma/client";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface BoardTitleFormProps {
  data: Board;
}

const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [title, setTitle] = useState(data.title);

  const{execute}=useAction(updateBoard,{
    onSuccess:(data)=>{
      toast.success(`Board Renamed to '${data.title}'`)
      setTitle(data.title)
      disableEditing();
    },onError:(error)=>{
      toast.error(error);
    }
  });

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
     inputRef.current?.focus();
     inputRef.current?.select(); 

    });
   
  };

  const onSubmit = async (formData:FormData) => {
    const title=formData.get('title') as string;

    execute({title, id:data.id})
  };

  const onBlur=()=>{
    formRef.current?.requestSubmit();
  }

  if (isEditing) {
    return (
      <form ref={formRef} className="flex items-center gap-x-2" action={onSubmit}>
        <FormInput
          id="title"
          ref={inputRef}
          onBlur={onBlur}
          onChange={()=>{}}
          defaultValue={title}
          className="text-md font-bold py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};

export default BoardTitleForm;

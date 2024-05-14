"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";
import { toast } from "sonner";
import FormPicker from "@/components/form/FormPicker";
import BoardDeleteAlert from "./BoardDeleteAlert";
import BoardChangeBg from "./BoardChangeBg";

interface BoardOptionsProps {
  id: string;
  boardTitle:string;
}
const BoardOptions = ({ id,boardTitle }: BoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDelete = () => {
    execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto p-2 w-auto" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2
           text-neutral-600"
            variant="ghost"
          >
            <X className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <BoardDeleteAlert onAction={onDelete} isDisabled={isLoading} triggerTitle="Delete Board" />

        <BoardChangeBg boardTitle={boardTitle} />
      </PopoverContent>
    </Popover>
  );
};

export default BoardOptions;

"use client";

import { Card } from "@prisma/client";
import React, { useEffect, useState } from "react";
import CardItemUserDisplay from "./CardItemUserDisplay";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";
import {
  AlignJustifyIcon,
  CheckSquareIcon,
  CircleCheckBig,
  CircleCheckBigIcon,
  ClockIcon,
  PaperclipIcon,
  TextQuote,
  TextQuoteIcon,
} from "lucide-react";
import { CardWithList, Task } from "@/types";
import { cn } from "@/lib/utils";

interface ICardItemProps {
  data: CardWithList;
  index: number;
}

const CardItem = ({ data, index }: ICardItemProps) => {
  const cardModal = useCardModal();
  const tasks: Task[] | null = JSON.parse(data.tasks!);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, [data.collaborators]);

  if (!isMounted) {
    return null;
  }

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="flex items-center justify-between border-2 flex-col gap-1 border-transparent hover:border-black/50 py-2 pb-1 px-3 bg-white rounded-md shadow-sm"
        >
          <div className="w-full">
            <p className="truncate text-sm">{data.title}</p>
          </div>
          <div className="flex-1 flex gap-2 items-center w-full py-1 ">
            {(data.dueDate || data.completed)&& (
              <span
                className={cn(
                  "text-[12px] p-1 flex gap-1 items-center text-gray-500 rounded-sm px-1 py-1 text-center",
                  data.completed===true && (data.dueDate! >= new Date() )&& "bg-green-500 text-white",
                  data.completed===false && (new Date()>  data.dueDate! ) && "bg-red-600 text-white",
                  data.completed===false && (data.dueDate!.getDay() == new Date().getDay()) && "bg-yellow-600 text-white",
                  data.completed===true && (data.dueDate ==null || undefined) && "bg-green-500 text-white"

                )}
              >
                {data.completed==true && ((data.dueDate! >= new Date()) || data.dueDate ==null) ? <CircleCheckBigIcon className="w-3 h-3 mr-1" /> : <ClockIcon className="w-3 h-3 mr-1" />}
                {data.dueDate?.toLocaleDateString("us-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
            {data.description && <TextQuoteIcon className="w-4 h-4  text-gray-500" />}
            {(data.links.length > 0 || data.images.length>0)&& (
              <span className="text-sm p-1 flex items-center  text-gray-500">
                <PaperclipIcon className="w-4 h-4 mr-1 text-gray-500" /> {data.links?.length + data.images?.length}
              </span>
            )}

            {tasks && (
              <span
                className={cn(
                  "text-sm  text-gray-600 flex items-center",
                  tasks?.filter((t) => t.completed == true).length ===
                    tasks?.length && "bg-green-500 text-white rounded-sm px-[2px] py-[1px]"
                )}
              >
                <CheckSquareIcon className={cn("w-4 h-4 mr-1  text-gray-500", tasks?.filter((t) => t.completed == true).length ===
                    tasks?.length && "text-white" )} />
                {`${tasks?.filter((t) => t.completed == true).length}/${
                  tasks?.length
                }`}
              </span>
            )}
            {data.collaborators.length > 0 && (
              <div className="ml-auto">
                <CardItemUserDisplay collaborators={data.collaborators} />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;

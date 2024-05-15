"use client";

import { updateCard } from "@/actions/update-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import { CardWithList } from "@/types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { useQueryClient } from "@tanstack/react-query";
import { formatRelative, subDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { ChangeEvent, ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

const CardDate = ({ data }: { data: CardWithList }) => {
  const params = useParams();

  const [dueDate, setDueDate] = useState<Date | null>(data.dueDate);
  const [cardCompleted, setCardCompleted] = useState<boolean>(
    data.completed || false
  );
  const queryClient = useQueryClient();

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      toast.success(`Card ${data.title} Updated.`);
      setDueDate(data.dueDate);
      setCardCompleted(data.completed || false);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const boardId = params.boardId as string;

  const onSelectDate = (date: Date | undefined) => {
    if (date===null || date === data.dueDate || date === dueDate) return;
    setDueDate(date!);

    execute({
      title: data.title,
      boardId,
      id: data.id,
      dueDate: date || undefined,
    });
  };

  const onCheckCompleted = (event: any) => {
    if (event === data.completed) return;

    const dateSet=new Date();
    execute({
      title: data.title,
      boardId,
      id: data.id,
      completed: event,
      dueDate:event===true ? dateSet:undefined
    });
  };

  return (
    <div className="mt-3">
      <h3 className="text-neutral-500 font-semibold text-sm">DUE DATE</h3>
      <div className="mt-2 flex gap-1 items-center">
        <Checkbox
          id="completed"
          name="completed"
          onCheckedChange={onCheckCompleted}
          className="h-6 w-6 border-neutral-200 bg-neutral-100"
          checked={cardCompleted}
          defaultChecked={cardCompleted}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "font-medium text-neutral-700 h-8 gap-1  w-[60%] flex items-center justify-start transition rounded-md p-1.5 pl-2 truncate bg-neutral-200 hover:bg-neutral-200/80 border-transparent relative focus-visible:border-input mb-0.5"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {data.dueDate ? (
                <>
                  {formatRelative(data.dueDate, new Date())}
                  {""}
                  {data.completed === true ? (
                    <span className="rounded-sm bg-green-500 text-white p-[0.8px] px-[4px] text-[12px] ml-auto">
                      Completed
                    </span>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <span className="text-neutral-700">Pick a Date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              id="dueDate"
              mode="single"
              selected={data.dueDate || undefined}
              onSelect={(selectedDay) => onSelectDate(selectedDay)}
              fromDate={new Date()}
              initialFocus
              disabled={cardCompleted}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default CardDate;

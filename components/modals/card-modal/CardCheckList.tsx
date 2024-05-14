import { updateCheckList } from "@/actions/update-checklist";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import { Task } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { uniqueId } from "lodash";
import { CheckIcon, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

const CardCheckList = ({ data, cardId }: { data: string; cardId: string }) => {
  const params = useParams();
  const [progress, setProgress] = useState<number>(0);
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  // const tasks: Task[] | null = JSON.parse(data!);
  const [tasks, setTasks] = useState<Task[]>(JSON.parse(data));
  const inputRef = useRef<ElementRef<"input">>(null);
  const formRef = useRef<ElementRef<"form">>(null);
  const [totalTasks, settotalTasks] = useState(tasks?.length || 0);
  const [completedTasks, setCompletedTasks] = useState(
    tasks?.filter((t) => t.completed === true).length || 0
  );

  const { execute, fieldErrors } = useAction(updateCheckList, {
    onSuccess: (data) => {
      toast.success("Card updated.");
      disableEditing();
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      
      const newData= JSON.parse(data.tasks!);
      setCompletedTasks(newData?.filter((t:Task) => t.completed === true).length || 0)
      settotalTasks(newData.length);

    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Update the progress when total or completed tasks change
  React.useEffect(() => {
    if (tasks !== null) {
      const progressNum=Number(((completedTasks / totalTasks) * 100).toFixed(1))
      setProgress(progressNum);
    }
  }, [tasks,totalTasks, completedTasks]);

  const OnDeleteTask = (id: string) => {
    const boardId = params.boardId as string;
    const newTasks= tasks.filter((item) =>item.id !== id);

    setTasks(newTasks);

   execute({ boardId, id: cardId, tasks: JSON.stringify(newTasks) });
  };

  const onCheckTask = (id: string, checked: boolean) => {
    const boardId = params.boardId as string;

    const newtTasks= tasks.map((item, idx) =>item.id === id ? { ...item, ['completed']: checked } : item);
    setTasks(newtTasks);
    // setCompletedTasks(newtTasks?.filter((t) => t.completed === true).length || 0)
    // settotalTasks(newtTasks.length);

   execute({ boardId, id: cardId, tasks: JSON.stringify(newtTasks) });
  };

  //editing
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

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key == "Enter") {
      formRef.current?.requestSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(inputRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = params.boardId as string;

    if (title.trim().length == 0) return;

    const newTask: Task = {
      id: uniqueId(),
      title: title,
      completed: false,
    };

    let newArr = [...tasks, newTask];

    setTasks(newArr);

    execute({ boardId, id: cardId, tasks: JSON.stringify(newArr) });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <CheckIcon className="w-5 h-5 mr-2 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Checklist</p>
        <div className="mt-2 w-full">
          <div className="flex-col flex gap-2 ">
            {tasks !== null && tasks?.length > 0 ? (
              <>
                <div className="flex gap-1 items center  mb-2 h-4">
                  <span className="text-neutral-500 text-sm font-medium">
                    {progress}%
                  </span>
                  <Progress value={progress} className="bg-neutral-200 h-3" />
                </div>
                <div className="flex flex-col gap-1.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex gap-2 px-2 items-center bg-neutral-100 p-1"
                    >
                      <Checkbox
                        className="border-neutral-400 bg-neutral-100"
                        checked={task.completed}
                        onCheckedChange={(checked) => { return onCheckTask(task.id, checked as boolean)}}
                      />
                      <p
                        className={cn(
                          "font-medium text-neutral-700  text-sm",
                          task.completed !== false && "line-through"
                        )}
                      >
                        {task.title}
                      </p>
                      <Button
                        size="inline"
                        variant="ghost"
                        className="ml-auto hover:bg-neutral-200/50" onClick={()=>OnDeleteTask(task.id)}
                      >
                        <TrashIcon className="w-3 h-3 text-neutral-700 " />
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-sm font-medium">No Tasks</div>
            )}
            <form action={onSubmit}>
              {isEditing && (
                <div>
                  <FormInput
                    id="title"
                    ref={inputRef}
                    className="font-semibold px-1 text-neutral-700 border border-neutral-500 bg-transparent relative focus:border-gray-600 focus:ring-1 focus:ring-neutral-500 focus-visible:bg-white focus-visible:border-1 focus-visible:ring-neutral-500 mb-0.5 truncate"
                  />
                </div>
              )}
              <div className="text-left">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={enableEditing}
                  className="mt-1 ml-auto"
                >
                  Add Task
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCheckList;

CardCheckList.Skeleton = function CardCheckListSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-2 w-20 mt-1 bg-neutral-200" />
      <div className="">
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};

"use client";

import { deleteCollaborator } from "@/actions/delete-collaborator";
import { updateCard } from "@/actions/update-card";
import FormPicker from "@/components/form/FormPicker";
import FormSubmit from "@/components/form/FormSubmit";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { UserClerk } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckIcon, SearchIcon, Users, X } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { ElementRef, use, useRef, useState } from "react";
import { toast } from "sonner";

interface ICardAssignUserProps {
  cardId: string;
  collaborators: string[];
  usersOnTeam:UserClerk[]|undefined
}

const CardAssignUser = ({ cardId, collaborators,usersOnTeam }: ICardAssignUserProps) => {
  const router = useRouter();
  const params = useParams();
  const closeRef = useRef<ElementRef<"button">>(null);
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const initialUsers=usersOnTeam?.filter((user) => collaborators.includes(user?.id!)) || [];
  const [usersSelected, setUsersSelected] = useState<UserClerk[]>(initialUsers);

  const { execute: executeUpdate } = useAction(updateCard, {
    onSuccess: (data) => {
      toast.success(`Card '${data.title}' updated.`);
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      // closeRef.current?.click();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeDelete } = useAction(deleteCollaborator, {
    onSuccess: (data) => {
      toast.success(`Card '${data.title}' updated.`);
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (user: UserClerk) => {
    if (collaborators.includes(user?.id!)) return;

    const boardId = params.boardId as string;
    const userId = user?.id as string;

    setUsersSelected((prevState) => [...prevState, user]);
    setOpen(false);

    let newCollaborators=collaborators.concat(userId);
    executeUpdate({ collaborators:newCollaborators, id: cardId, boardId: boardId });
  };

  const onDelete = (user: UserClerk) => {
    if (!collaborators.includes(user?.id!)) return;

    const boardId = params.boardId as string;
    const userId = user?.id as string;

    setUsersSelected((prevState) => [
      ...prevState.filter((x) => x?.id !== user?.id),
    ]);
    setOpen(false);
    executeDelete({ id: userId, cardId: cardId, boardId: boardId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="gray"
          className="w-auto  md:w-full justify-start"
          size="inline"
        >
          <Users className="w-4 h-4 mr-2" /> Assign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Card</DialogTitle>
        </DialogHeader>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              Select Users...
              <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command
              filter={(value, search, keywords) => {
                const extendValue =
                  value.toLowerCase() + " " + keywords?.join(" ");
                if (extendValue.includes(search.toLowerCase())) return 1;
                return 0;
              }}
            >
              <CommandInput
                placeholder="Search Users..."
                className="h-9 w-[300px]"
              />
              {usersOnTeam && usersOnTeam.length > 0 ? (
                <>
                  {usersOnTeam.map((user: UserClerk) => (
                    <CommandList
                      key={user?.id}
                      className="cursor-pointer hover:bg-neutral-600/10"
                      onClick={() => onSubmit(user)}
                      
                    >
                      <CommandItem
                        keywords={[
                          user?.firstName?.toLowerCase()!,
                          user?.lastName?.toLowerCase() || "",
                          user?.emailAddresses[0].emailAddress.toLowerCase()!,
                        ]}
                        value={user?.id}
                        disabled={collaborators.includes(user?.id!)

                        }
                      >
                        <div className=" flex items-center w-full">
                          <Image
                            src={user?.imageUrl!}
                            width={15}
                            height={15}
                            alt="profile"
                            className="rounded-full mr-2"
                          />
                          <div className="flex gap-1 items-center">
                            <p className="w-[95%] truncate">
                              {`${user?.firstName} ${user?.lastName || ""}, ${
                                user?.emailAddresses[0].emailAddress
                              }`}
                            </p>
                          </div>
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              collaborators.includes(user?.id!) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    </CommandList>
                  ))}
                </>
              ) : (
                <CommandEmpty>No Users found.</CommandEmpty>
              )}
            </Command>
          </PopoverContent>
        </Popover>
        <div className="w-full p-2 mt-1">
          <p className="text-xs font-semibold text-neutral-700">Assigned to</p>
          <div className="mt-1 w-full gap-1.5 flex items-center flex-wrap">
            {usersSelected.length === 0 ? (
              <div className="flex mt-2 p-2 rounded-md justify-center items-center text-center">No users</div>
            ) : (
              <>
                {usersSelected?.map((user) => (
                  <div
                    key={user?.id}
                    className="flex p-1 px-2 pr-0 bg-neutral-200 rounded-md gap-2 items-center"
                  >
                    <Image
                      src={user?.imageUrl || ""}
                      alt="user"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <p className="text-sm font-semibold text-neutral-800">{user?.firstName}</p>
                    <Button
                      onClick={() => onDelete(user)}
                      className="hover:bg-neutral-300/60"
                      variant="ghost"
                      size="inline"
                    >
                      <X className="w-3 h-3 text-neutral-800" />
                    </Button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardAssignUser;

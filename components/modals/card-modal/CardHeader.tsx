"use client";
import React, { ElementRef, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FormInput } from "@/components/form/FormInput";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList, UserClerk } from "@/types";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";
import { User } from "@clerk/nextjs/server";
import { fetcher } from "@/lib/fetcher";
import Link from "next/link";
import Image from "next/image";
import CardDate from "./CardDate";
import { Layout } from "lucide-react";
import { useEventListener } from "usehooks-ts";

interface ICardHeaderProps {
  data: CardWithList;
  users: UserClerk[] | undefined;
}

const CardHeader = ({ data, users }: ICardHeaderProps) => {
  const [title, setTitle] = useState(data.title);

  const params = useParams();
  const formRef = useRef<ElementRef<"form">>(null);

  const inputRef = useRef<ElementRef<"input">>(null);

  const queryClient = useQueryClient();
  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });

      toast.success(`Card ${data.title} Updated.`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { data: creator } = useQuery<User>({
    queryKey: ["users", data?.userId],
    queryFn: () => fetcher({ url: `/api/users/${data?.userId}` }),
  });

  const onBlur = () => {
    setTitle((prevState) => inputRef.current?.value || data.title);

    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      inputRef.current?.focus();
    }
  };

  useEventListener("keydown", onKeyDown);

  const formattedDate = new Date(data.createdAt).toDateString();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputRef.current?.value === data.title) return;
    const boardId = params.boardId as string;

    execute({
      title: inputRef.current?.value,
      boardId,
      id: data.id,
    });
  };

  return (
    <div className="flex items-start mb-6 gap-x-3 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form onSubmit={onSubmit} ref={formRef}>
          <FormInput
            id="title"
            ref={inputRef}
            onBlur={onBlur}
            placeholder={title}
            defaultValue={title || undefined}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
          <p className="text-muted-foreground text-sm ">
            in List <span className="underline">{data.list.title}</span>,
            created on <span>{formattedDate}</span> by:{" "}
            <span className="font-semibold capitalize">
              {creator==null ? 'user' : (<Link href="/">{`${creator?.firstName} ${
                creator?.lastName === null && ""
              }`}</Link>)}
            </span>
          </p>
          {users !== undefined && users?.length > 0 && data.collaborators.length>0 && (
            <div className=" mt-3 mb-2">
              <h3 className="text-neutral-500 font-semibold text-sm">
                MEMBERS
              </h3>
              <div className="flex gap-2 mt-2">
                {users?.map((user) => {
                  if (data.collaborators.includes(user?.id || "")) {
                    return (
                      <div
                        key={user?.id}
                        className="rounded-full object-contain w-6 h-6"
                      >
                        <Image
                          src={user?.imageUrl || ""}
                          alt="profile"
                          title={`${user?.firstName} ${user?.lastName} | ${user?.emailAddresses[0].emailAddress}`}
                          width={100}
                          height={100}
                          className=" w-full rounded-full object-contain"
                        />
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}
        </form>
        <CardDate data={data} />
      </div>
    </div>
  );
};

CardHeader.Skeleton = function CardHeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div className="">
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};

export default CardHeader;

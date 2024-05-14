import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { UserClerk } from "@/types";
import { User } from "@clerk/clerk-sdk-node";
import { clerkClient } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const CardItemUserDisplay = ({
  collaborators,
}: {
  collaborators: string[];
}) => {
  const [users, setUsers] = useState<User[] | undefined>([]);
  const params = useParams();

  const { data: usersOnTeam } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetcher({ url: `/api/users/board/${params.boardId}` }),
  });

  useEffect(() => {
    setUsers(usersOnTeam?.filter(u=>collaborators.includes(u?.id!)));
  }, [collaborators]);

  if (!users) return null;

  return (
    <div className="inline-flex overflow-hidden w-10 relative items-center h-auto">
      {users.map((user, idx) =>
        idx > 1 ? (
          <div
            key={idx}
            className={cn(
              "rounded-full w-3 h-3 bg-gray-800/70 overflow-hidden flex items-center justify-center right-1 absolute"
            )}
          >
            <Plus className="w-2 h-2 text-gray-100" />
          </div>
        ) : (
          <div
            key={user.firstName}
            className={cn(
              "rounded-full w-4 h-4 border-1 overflow-hidden border-gray-400",
              idx > 0 ? ` -ml-[${idx * 2 + 4}px]` : ""
            )}
          >
            <Image
              src={user.imageUrl}
              alt="user profile"
              width={4}
              height={4}
              className="object-cover w-4 h-4"
            />
          </div>
        )
      )}
    </div>
  );
};

export default CardItemUserDisplay;

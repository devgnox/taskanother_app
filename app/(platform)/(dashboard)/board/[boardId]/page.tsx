import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import ListContainer from "./_components/ListContainer";

interface IBoardPageProps {
  params: {
    boardId: string;
  };
}

const BoardPage = async ({ params }: IBoardPageProps) => {
  const { orgId } = auth();
  if (!orgId) redirect("/select-org");

  const lists = await db.list.findMany({
    where: { boardId: params.boardId, board: { orgId } },
    include: {
      cards: {
        orderBy: {
          order: "asc", 
        },
        include:{
          images:true,
          links:true,
        }
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  // if(!lists) return 

  return <div className="p-4 h-full overflow-x-auto">
    <ListContainer boardId={params.boardId} data={lists} />
  </div>;
};

export default BoardPage;

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import BoardTitleForm from "./BoardTitleForm";
import BoardOptions from "./BoardOptions";

interface BoardNavbarProps {
  data: Board;
}
const BoardNavbar = async ({ data }: BoardNavbarProps) => {
  const { orgId } = auth();

  return (
    <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center text-white px-6 gap-x-4">
      <BoardTitleForm data={data} />
      <div className="ml-auto">
        <BoardOptions id={data.id} boardTitle={data.title} />
      </div>
    </div>
  );
};

export default BoardNavbar;

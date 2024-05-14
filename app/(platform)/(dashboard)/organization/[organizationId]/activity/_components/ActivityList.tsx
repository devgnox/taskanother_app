'use server'

import { auth } from "@clerk/nextjs";
import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import ActivityItem from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";

const ActivityList = async () => {
  const { orgId } = auth();

  if (!orgId) redirect("/select-org");

  const auditLogs = await db.auditLog.findMany({
    where: {
      orgId,
    },
    orderBy:{
      createdAt:'desc'
    }
  });

  return (
    <ol className="space-y-4 mt-4 mb-2">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity found in this organization.{" "}
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  );
};

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-[80%] h-14" />
      <Skeleton className="w-[50%] h-14" />
      <Skeleton className="w-[70%] h-14" />
      <Skeleton className="w-[24%] h-14" />
      <Skeleton className="w-[95%] h-14" />
      <Skeleton className="w-[44%] h-14" />
      <Skeleton className="w-[55%] h-14" />
    </ol>
  );
};


export default ActivityList;


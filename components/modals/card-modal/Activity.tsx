import ActivityItem from "@/components/ActivityItem";
import { Skeleton } from "@/components/ui/skeleton";
import { AuditLog } from "@prisma/client";
import { ActivityIcon } from "lucide-react";
import React from "react";

interface ActivityProps {
  items: AuditLog[];
}
const Activity = ({ items }: ActivityProps) => {

  return (
    <div className="flex items-start gap-x-3 w-full">
      <ActivityIcon className="w-5 h-5 mr-2 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Audit Logs</p>
        {items.length < 1 ? (
          <div className="py-2 px-3 bg-neutral-100 text-sm">No logs</div>
        ) : (
          <ol className="mt-2 space-y-4">
            {items.map((item) => (
              <ActivityItem key={item.id} data={item} />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default Activity;

Activity.Skeleton = function ActivitySkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="bg-neutral-200 h-6 w-6" />
      <div className="w-full">
        <Skeleton className="bg-neutral-200 mb-2 h-6 w-24" />
        <Skeleton className="bg-neutral-200 h-10 w-full" />
      </div>
    </div>
  );
};

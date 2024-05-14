import { checkSubscription } from "@/lib/subscription";
import React from "react";
import Info from "../_components/Info";
import { Separator } from "@/components/ui/separator";
import SubscriptionButton from "./_components/SubscriptionButton";

const BillingPage = async () => {
  const isPro = await checkSubscription();
  return (
    <div className="w-full ">
      <Info isPro={isPro} />
      <Separator className="my-2" />
      <div className="w-full space-y-4 my-5">
        <h2 className="text-2xl text-neutral-700 font-semibold">
          You are a {isPro ? "Pro" : "Free"} Member
        </h2>
        <p className="text-sm text-neutral-500">
          {isPro
            ? `To see your subscription's details click below`
            : "To access more boards and limitless features click below"}
        </p>
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
  );
};

export default BillingPage;

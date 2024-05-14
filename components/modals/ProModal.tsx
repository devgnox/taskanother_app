"use client";
import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { toast } from "sonner";

const ProModal = () => {
  const proModal = useProModal();
  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess(data) {
      window.location.href = data;
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className="aspect-video relative flex items-center justify-center p-1 mt-2">
          <Image
            src="/undraw_upgrade.svg"
            alt="Hero"
            className="object-cover"
            fill
          />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to TaskAnother Pro Today!
          </h2>
          <p className="text-xs font-semibold text-neutral-600">
            {" "}
            Explore the best of TaskAnother
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features Boards</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button className="w-full" variant="primary" disabled={isLoading} onClick={onClick}>
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;

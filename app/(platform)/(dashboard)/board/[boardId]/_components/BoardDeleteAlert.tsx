"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React from "react";

interface IBoardDeleteAlertProps {
  onAction: () => void;
  isDisabled: boolean;
  triggerTitle:string;
  // children:React.ReactNode;
}

const BoardDeleteAlert = ({ onAction, isDisabled, triggerTitle }:IBoardDeleteAlertProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full text-start">
        <p className="rounded-none w-full h-auto p-2 px-5 font-normal text-sm hover:bg-accent">{triggerTitle}</p>
      
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to perform this action?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this Board and all of it&apos;s content.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel  disabled={isDisabled}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAction} disabled={isDisabled}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BoardDeleteAlert;

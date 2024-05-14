"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface IFormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  size?:"default" | "sm" | "lg" | "icon" | null | undefined;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}

const FormSubmit = ({
  children,
  disabled,
  className,
  size='sm',
  variant = "primary",
}: IFormSubmitProps) => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      variant={variant}
      size={size}
      className={cn(className)}
    >
      {children}
    </Button>
  );
};

export default FormSubmit;

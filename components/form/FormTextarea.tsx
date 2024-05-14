"use client";
import React, { forwardRef, KeyboardEventHandler } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import FormErrors from "./FormErrors";
import { useFormStatus } from "react-dom";

interface IFormTextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disable?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeydown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string;
}

const FormTextarea = forwardRef<HTMLTextAreaElement, IFormTextareaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disable,
      errors,
      className,
      onBlur,
      onClick,
      onKeydown,
      defaultValue,
    },
    ref
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label ? (
            <Label
              htmlFor={id}
              className="textxs
           font-semibold text-neutral-700"
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            id={id}
            ref={ref}
            name={id}
            placeholder={placeholder}
            required={required}
            disabled={pending || disable}
            onKeyDown={onKeydown}
            onBlur={onBlur}
            onClick={onClick}
            className={cn(
              "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
              className
            )}
            aria-describedby={`${id}-error`}
            defaultValue={defaultValue}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;

"use client";

import clsx, { ClassValue } from "clsx";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface FormWrapperProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void | Promise<void>;
  onError?: (errors: any) => void;
  className?: string;
  children: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const FormWrapper = ({
  form,
  onSubmit,
  onError,
  className,
  children,
  onKeyDown,
}: FormWrapperProps) => {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(onSubmit, onError)(e);
        }}
        className={cn("", className)}
        onKeyDown={onKeyDown}
      >
        {children}
      </form>
    </FormProvider>
  );
};

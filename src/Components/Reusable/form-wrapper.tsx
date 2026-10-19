"use client";

import { FormProvider, UseFormReturn } from "react-hook-form";
import { cn } from "../ui/utils";

interface FormWrapperProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void | Promise<void>;
  onError?: (errors: any) => void;
  className?: string;
  children: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
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

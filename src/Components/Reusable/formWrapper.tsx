"use client";

import {
  FieldValues,
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormReturn,
} from "react-hook-form";
import { cn } from "../ui/utils";

interface FormWrapperProps<TFieldValues extends FieldValues = FieldValues> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  onError?: SubmitErrorHandler<TFieldValues>;
  className?: string;
  children: React.ReactNode;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const FormWrapper = <TFieldValues extends FieldValues = FieldValues>({
  form,
  onSubmit,
  onError,
  className,
  children,
  onKeyDown,
}: FormWrapperProps<TFieldValues>) => {
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

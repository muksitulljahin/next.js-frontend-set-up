"use client";

import * as React from "react";
import { cn } from "./utils";

type TableSize = "sm" | "md";

const TableSizeContext = React.createContext<TableSize>("md");

export const useTableSize = () => React.useContext(TableSizeContext);

function Table({
  className,
  size = "md",
  ...props
}: React.ComponentProps<"table"> & { size?: TableSize }) {
  return (
    <TableSizeContext.Provider value={size}>
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-xs", className)}
        {...props}
      />
    </TableSizeContext.Provider>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b dark:[&_tr]:border-slate-800", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium dark:border-slate-800 dark:bg-slate-900/50 [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors dark:border-slate-800 dark:hover:bg-slate-900/50 dark:data-[state=selected]:bg-slate-900/50",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  const size = useTableSize();

  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground text-left align-middle font-medium whitespace-nowrap dark:text-slate-300",
        size === "sm" ? "h-8 px-2" : "h-10 px-3",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  const size = useTableSize();

  return (
    <td
      data-slot="table-cell"
      className={cn(
        "align-middle whitespace-nowrap",
        size === "sm" ? "p-1.5" : "p-2",
        "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className,
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  const size = useTableSize();

  return (
    <caption
      data-slot="table-caption"
      className={cn(
        "text-muted-foreground mt-4 dark:text-slate-400",
        size === "sm" ? "text-xs" : "text-sm",
        className,
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

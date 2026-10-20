import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui/slot";
import { cn } from "../ui/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-bold whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [&>svg]:pointer-events-none [&>svg]:size-3 capitalize",
  {
    variants: {
      variant: {
        // design system
        default: "bg-primary text-primary-foreground border-primary",
        secondary: "bg-secondary text-secondary-foreground border-secondary",
        destructive: "bg-destructive/10 text-destructive border-destructive",
        outline: "border-border text-foreground border-1",
        ghost: "hover:bg-muted hover:text-muted-foreground border-1",
        link: "text-primary underline-offset-4 hover:underline border-primary",

        // workflow
        draft: "bg-gray-100 text-gray-700 border-gray-300",
        sent: "bg-blue-100 text-blue-700 border-blue-300",
        partial: "bg-yellow-100 text-yellow-700 border-yellow-300",
        received: "bg-green-100 text-green-700 border-green-300",

        // finance / purchase
        po: "bg-indigo-100 text-indigo-700 border-indigo-300",
        submit: "bg-indigo-100 text-indigo-700 border-indigo-300",
        submitted:
          "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
        Submitted:
          "bg-indigo-100 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
        receive: "bg-green-100 text-green-700 border-green-300",
        return: "bg-red-100 text-red-700 border-red-300",
        supplier: "bg-purple-100 text-purple-700 border-purple-300",
        suppliers: "bg-purple-100 text-purple-700 border-purple-300",
        review_done: "bg-purple-100 text-purple-700 border-purple-300",
        payment: "bg-emerald-100 text-emerald-700 border-emerald-300",
        payments: "bg-emerald-100 text-emerald-700 border-emerald-300",
        working: "bg-emerald-100 text-emerald-700 border-emerald-300",
        pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        reviewed: "bg-yellow-200 text-yellow-800 border-yellow-400",
        Pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
        review: "bg-yellow-100 text-yellow-700 border-yellow-300",

        approved: "bg-green-100 text-green-700 border-green-300",
        Approved: "bg-green-100 text-green-700 border-green-300",
        processed: "bg-green-100 text-green-700 border-green-300",
        rejected: "bg-red-100 text-red-700 border-red-300",
        REJECTED: "bg-red-100 text-red-700 border-red-300",
        Rejected: "bg-red-100 text-red-700 border-red-300",
        hold: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
        Hold: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
        cancelled: "bg-red-50 text-red-600 border-red-50",
        active: "bg-green-100 text-green-700 border-green-300",
        Active: "bg-green-100 text-green-700 border-green-300",
        inactive: "bg-red-100 text-red-700 border-red-300",
        Inactive: "bg-red-100 text-red-700 border-red-300",
        completed: "bg-green-100 text-green-700 border-green-300",
        "IE Pending":
          "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50",
        "HR Pending":
          "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/50",
        "HR Approved":
          "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50",
        "HR Rejected":
          "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/50",

        // places
        division: "bg-blue-100 text-blue-700 border-blue-300",
        district: "bg-indigo-100 text-indigo-700 border-indigo-300",
        upazila: "bg-green-100 text-green-700 border-green-300",
        post_office: "bg-yellow-100 text-yellow-700 border-yellow-300",

        // 🔍 matching
        matched: "bg-green-100 text-green-700 border-green-300",
        variance: "bg-red-100 text-red-700 border-red-300",

        // customer
        regular: "bg-gray-100 text-gray-700 border-gray-300",
        silver: "bg-zinc-200 text-zinc-700 border-zinc-300",
        gold: "bg-yellow-100 text-yellow-700 border-yellow-300",
        platinum: "bg-blue-100 text-blue-700 border-blue-300",
        published: "bg-green-100 text-green-700 border-green-300",
        forign: "text-green-700 border-green-100",

        approvedHR: "bg-emerald-100 text-emerald-700 border-emerald-300",

        approived: "bg-emerald-100 text-emerald-700 border-emerald-300",
        plant: "bg-indigo-100 text-indigo-700 border-indigo-300",
        account:
          "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",

        // 📋 attendance & job card
        present:
          "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
        Present:
          "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
        late: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
        Late: "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
        "early leave":
          "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
        "Early Leave":
          "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
        holiday:
          "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
        Holiday:
          "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700",
        "government holiday":
          "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
        "Government Holiday":
          "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
        "Govt Holiday":
          "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
        "govt holiday":
          "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
        "Govt. Holiday":
          "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
        cl: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
        CL: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
        leave:
          "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
        Leave:
          "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800",
        absent:
          "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
        Absent:
          "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
        time: "bg-blue-50/70 text-blue-600 border-blue-200/80 font-mono lowercase dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
        deducted:
          "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50",

        // 🎯 KPI Performance categories
        "Core Competency":
          "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
        Technical:
          "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
        Behavioral:
          "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
        Organizational:
          "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",

        // // 🏆 KPI Approval Stages
        pending_approval:
          "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-900/50",
        "plant head":
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50",
        md: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type BadgeProps = React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
  };

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>;

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

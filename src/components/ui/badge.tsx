import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-gray-200 bg-white text-gray-900 shadow-sm hover:bg-gray-50",
        secondary:
          "border border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive:
          "border border-red-200 bg-red-100 text-red-800 shadow-sm hover:bg-red-200",
        outline: "text-gray-900 border border-gray-200",
        success:
          "border border-emerald-200 bg-emerald-50 text-emerald-800 shadow-sm hover:bg-emerald-100",
        warning:
          "border border-amber-200 bg-amber-50 text-amber-800 shadow-sm hover:bg-amber-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

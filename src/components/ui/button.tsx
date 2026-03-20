import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-cyan-600 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)] hover:bg-cyan-500 hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] border border-cyan-400/50 transition-all duration-300",
        destructive: "bg-red-900/50 text-red-200 border border-red-900 shadow-sm hover:bg-red-900/80 hover:border-red-500/50 transition-all duration-300",
        outline:
          "border border-slate-700 bg-slate-950/50 backdrop-blur-sm shadow-sm hover:bg-cyan-950/50 hover:text-cyan-50 hover:border-cyan-500/50 transition-all duration-300",
        secondary:
          "bg-slate-800 text-slate-50 shadow-sm hover:bg-slate-700 border border-slate-700/50 transition-all duration-300",
        ghost: "hover:bg-slate-800/50 hover:text-cyan-50 transition-all duration-300",
        link: "text-cyan-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

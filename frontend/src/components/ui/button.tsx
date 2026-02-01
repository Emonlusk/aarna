import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-soft",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-soft",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        student: "bg-student text-student-foreground hover:bg-student/90 shadow-soft",
        teacher: "bg-teacher text-teacher-foreground hover:bg-teacher/90 shadow-soft",
        admin: "bg-admin text-admin-foreground hover:bg-admin/90 shadow-soft",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-soft",
        gradient: "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:opacity-90 shadow-soft",
        "gradient-student": "bg-gradient-to-r from-student to-orange-400 text-student-foreground hover:opacity-90 shadow-soft",
        "gradient-teacher": "bg-gradient-to-r from-teacher to-blue-400 text-teacher-foreground hover:opacity-90 shadow-soft",
        "gradient-admin": "bg-gradient-to-r from-admin to-purple-400 text-admin-foreground hover:opacity-90 shadow-soft",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        "soft-student": "bg-student/10 text-student hover:bg-student/20",
        "soft-teacher": "bg-teacher/10 text-teacher hover:bg-teacher/20",
        "soft-admin": "bg-admin/10 text-admin hover:bg-admin/20",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
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
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

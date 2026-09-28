import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ruga-sky disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ruga-navy text-white hover:bg-ruga-royal shadow-soft",
        palm: "bg-palm-deep text-white hover:bg-palm-deep/90 shadow-soft",
        outline: "border border-line bg-white text-ink hover:border-ruga-sky/70 hover:bg-ruga-sky/5",
        ghost: "text-slate-500 hover:text-ink hover:bg-slate-100",
        danger: "border border-rose-200 bg-white text-danger hover:bg-rose-50",
        sky: "bg-ruga-sky text-white hover:bg-ruga-sky/90 shadow-soft",
        white: "bg-white text-ruga-navy hover:bg-ruga-sky/10",
      },
      size: {
        sm: "h-8 rounded-[10px] px-3 text-xs",
        md: "h-10 rounded-btn px-4 text-[13px]",
        lg: "h-12 rounded-btn px-6 text-sm",
        icon: "h-9 w-9 rounded-btn",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

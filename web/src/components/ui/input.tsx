import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-lg bg-transparent text-zinc-400 resize-none text-base outline-none p-1 placeholder:text-zinc-500 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        autoComplete="off"
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };

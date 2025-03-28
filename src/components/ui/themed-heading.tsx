import * as React from "react";
import { cn } from "@/lib/utils";

interface ThemedHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  decorated?: boolean;
}

const ThemedHeading = React.forwardRef<HTMLHeadingElement, ThemedHeadingProps>(
  ({ className, as = "h2", decorated = false, ...props }, ref) => {
    const Component = as;
    return (
      <Component
        ref={ref}
        className={cn(
          "font-display",
          {
            "text-4xl font-bold": as === "h1",
            "text-3xl font-bold": as === "h2",
            "text-2xl font-semibold": as === "h3",
            "text-xl font-semibold": as === "h4",
            "text-lg font-medium": as === "h5",
            "text-base font-medium": as === "h6",
            "heading-decorative": decorated,
          },
          className
        )}
        {...props}
      />
    );
  }
);
ThemedHeading.displayName = "ThemedHeading";

export { ThemedHeading };

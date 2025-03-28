import * as React from "react";
import { cn } from "@/lib/utils";

const SECTION_VARIANTS = {
  default: "bg-background",
  traditional: "bg-traditional-pattern text-white",
  handmade: "bg-handmade-paper",
  highlight: "bg-primary/5",
  pottery: "bg-pottery/10",
};

interface ThemedSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: keyof typeof SECTION_VARIANTS;
  container?: boolean;
}

const ThemedSection = React.forwardRef<HTMLElement, ThemedSectionProps>(
  ({ className, variant = "default", container = true, ...props }, ref) => (
    <section
      ref={ref}
      className={cn("py-16", SECTION_VARIANTS[variant], className)}
      {...props}
    >
      {container && (
        <div className="container mx-auto px-4">{props.children}</div>
      )}
      {!container && props.children}
    </section>
  )
);
ThemedSection.displayName = "ThemedSection";

export { ThemedSection };

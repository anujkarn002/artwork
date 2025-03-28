import * as React from "react";
import { cn } from "@/lib/utils";

const CARD_VARIANTS = {
  default: "bg-card text-card-foreground shadow-sm border",
  handmade:
    "bg-handmade-paper text-card-foreground shadow-sm border border-border",
  decorated:
    "bg-card text-card-foreground shadow-sm border-2 border-primary/20",
  pottery:
    "bg-pottery/10 text-card-foreground shadow-sm border border-pottery/20",
};

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof CARD_VARIANTS;
}

const ThemedCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn("rounded-lg", CARD_VARIANTS[variant], className)}
      {...props}
    />
  )
);
ThemedCard.displayName = "ThemedCard";

const ThemedCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
ThemedCardHeader.displayName = "ThemedCardHeader";

const ThemedCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
ThemedCardTitle.displayName = "ThemedCardTitle";

const ThemedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
ThemedCardDescription.displayName = "ThemedCardDescription";

const ThemedCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
ThemedCardContent.displayName = "ThemedCardContent";

const ThemedCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
ThemedCardFooter.displayName = "ThemedCardFooter";

export {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardFooter,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
};

import { Badge, BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CustomBadgeProps extends Omit<BadgeProps, "variant"> {
  variant?: "default" | "destructive" | "secondary" | "outline" | "success";
}

export function CustomBadge({
  variant = "default",
  className,
  ...props
}: CustomBadgeProps) {
  // Map our custom variants to appropriate classes
  const variantClasses = {
    success: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
  };

  // If it's a standard variant, pass it through, otherwise use our custom classes
  const isCustomVariant = variant === "success";

  return (
    <Badge
      variant={isCustomVariant ? "outline" : (variant as BadgeProps["variant"])}
      className={cn(
        isCustomVariant &&
          variantClasses[variant as keyof typeof variantClasses],
        className
      )}
      {...props}
    />
  );
}

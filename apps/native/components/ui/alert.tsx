import type { LucideIcon } from "lucide-react-native";
import * as React from "react";
import { View, type ViewProps } from "react-native";
import { Icon } from "@/components/ui/icon";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function Alert({
  className,
  variant,
  children,
  icon,
  iconClassName,
  ...props
}: ViewProps &
  React.RefAttributes<View> & {
    icon: LucideIcon;
    variant?: "default" | "destructive";
    iconClassName?: string;
  }) {
  return (
    <TextClassContext.Provider
      value={cn(
        "text-foreground text-sm",
        variant === "destructive" && "text-destructive",
        className,
      )}
    >
      <View
        role="alert"
        className={cn(
          "relative w-full rounded-lg border border-border bg-card px-4 pt-3.5 pb-2",
          className,
        )}
        {...props}
      >
        <View className="absolute top-3 left-3.5">
          <Icon
            as={icon}
            className={cn(
              "size-4",
              variant === "destructive" && "text-destructive",
              iconClassName,
            )}
          />
        </View>
        {children}
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  return (
    <Text
      className={cn(
        "mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        "ml-0.5 pb-1.5 pl-6 text-muted-foreground text-sm leading-relaxed",
        textClass?.includes("text-destructive") && "text-destructive/90",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };

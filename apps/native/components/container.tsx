import { cn } from "@/lib/utils";
import type React from "react";
import { SafeAreaView } from "react-native";

export const Container = ({ className, children }: { className?:string, children: React.ReactNode }) => {
  return (
    <SafeAreaView className={`${cn("flex-1 bg-background", className)}`}>{children}</SafeAreaView>
  );
};

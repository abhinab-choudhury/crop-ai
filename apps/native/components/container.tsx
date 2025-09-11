import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <SafeAreaView className={`flex-1 bg-background ${className || ''}`}>{children}</SafeAreaView>
  );
};

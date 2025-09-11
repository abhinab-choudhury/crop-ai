import * as React from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import logo from '@/assets/icon.png';
import GoogleSignIn from '@/components/google-sign-in';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';

export default function Login() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  if (isSignedIn || user) {
    return <Redirect href={'/(drawer)'} />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Card className="w-full max-w-sm rounded-2xl shadow-none border-0">
        <CardHeader className="items-center">
          <Image source={logo} className="w-16 h-16 mb-3" />
          <CardTitle className="text-xl font-semibold text-foreground">
            Welcome to Crop AI
          </CardTitle>
          <Text className="text-muted-foreground text-sm mt-1">Sign in to continue</Text>
        </CardHeader>

        <CardContent className="mt-4 space-y-3">
          <GoogleSignIn />
        </CardContent>
      </Card>
    </View>
  );
}

import * as React from 'react';
import { Image, View, Alert, ActivityIndicator } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import logo from '@/assets/icon.png';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    // Simulate network delay for a more realistic experience
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const userData = {
      id: 'google-123',
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '+91 9876543210',
      location: 'Jharkhand, India',
      farmSize: '3.5 acres',
      preferredCrops: ['Rice', 'Maize', 'Vegetables'],
      joinDate: new Date().toISOString().split('T')[0],
    };

    login(userData);
    setGoogleLoading(false);
    router.replace('/');
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const userData = {
      id: 'demo-1',
      name: 'Demo Farmer',
      email: 'demo@cropai.com',
      phone: '+91 9876543210',
      location: 'Jharkhand, India',
      farmSize: '5 acres',
      preferredCrops: ['Rice', 'Wheat', 'Vegetables'],
      joinDate: '2024-01-15',
    };

    login(userData);
    setIsLoading(false);
    router.replace('/');
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Card className="w-full max-w-sm rounded-2xl shadow-none border-none">
        <CardHeader className="items-center">
          <Image source={logo} className="w-16 h-16 mb-3" />
          <CardTitle className="text-xl font-semibold text-foreground">
            Welcome to Crop AI
          </CardTitle>
          <Text className="text-muted-foreground text-sm mt-1">Sign in to continue</Text>
        </CardHeader>

        <CardContent className="mt-4 space-y-3">
          <Button
            variant="outline"
            size="lg"
            className="flex flex-row items-center justify-center space-x-2 rounded-xl border-muted-foreground/20"
            onPress={handleGoogleLogin}
            disabled={googleLoading || isLoading}
          >
            {googleLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Image
                  className="w-5 h-5"
                  source={{
                    uri: 'https://img.clerk.com/static/google.png?width=160',
                  }}
                />
                <Text className="text-foreground font-medium">Continue with Google</Text>
              </>
            )}
          </Button>

          <Button
            size="lg"
            className="rounded-xl bg-green-600"
            onPress={handleDemoLogin}
            disabled={googleLoading || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-medium">Demo Login (For Testing)</Text>
            )}
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}

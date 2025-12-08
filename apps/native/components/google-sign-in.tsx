import React, { useCallback, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useSSO } from '@clerk/clerk-expo';
import { View, Image, Text } from 'react-native';
import { router } from 'expo-router';
import { Button } from './ui/button';

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  useWarmUpBrowser();

  // Use the `useSSO()` hook to access the `startSSOFlow()` method
  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    console.log('Google Button Clicked');

    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'cropai',
      });

      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (createdSessionId) {
        setActive!({
          session: createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              console.log(session.currentTask);
              return;
            }

            router.push('/(drawer)');
          },
        });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, []);

  return (
    <Button
      variant="outline"
      size="lg"
      className="flex flex-row items-center justify-center space-x-2 rounded-xl border-muted-foreground/20"
      onPress={onPress}
    >
      <Image
        className="w-5 h-5"
        source={{
          uri: 'https://img.clerk.com/static/google.png?width=160',
        }}
      />
      <Text className="text-foreground font-medium">Continue with Google</Text>
    </Button>
  );
}

import { Stack } from "expo-router";
import {
    DarkTheme,
    DefaultTheme,
    type Theme,
    ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useRef } from "react";
import { ActivityIndicator, Platform, View } from "react-native";

import "../global.css";
import {
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    useFonts,
} from "@expo-google-fonts/poppins";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/use-color-scheme";
import { setAndroidNavigationBar } from "@/lib/android-navigation-bar";

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light.colors,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark.colors,
};

export const unstable_settings = {
    initialRouteName: "(drawer)",
};

export default function RootLayout() {
    const hasMounted = useRef(false);
    const { colorScheme, isDarkColorScheme } = useColorScheme();
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
    const [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_700Bold,
    });
    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) return;

        if (Platform.OS === "web") {
            document.documentElement.classList.add("bg-background");
        }

        setAndroidNavigationBar(colorScheme);
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    if (!fontsLoaded || !isColorSchemeLoaded) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
            <SafeAreaProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <Stack screenOptions={{ headerShown: false }}>
                        {/* (drawer) layout will render here */}
                        <Stack.Screen name="(drawer)" />
                    </Stack>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

// make sure it runs properly in SSR & native
const useIsomorphicLayoutEffect =
    Platform.OS === "web" && typeof window === "undefined"
        ? React.useEffect
        : React.useLayoutEffect;

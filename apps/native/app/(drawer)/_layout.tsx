import React, { ComponentProps } from "react";
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { DefaultTheme, Theme } from "@react-navigation/native";
import { NAV_THEME, THEME } from "@/lib/constants";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Image, Text, TouchableOpacity, View } from "react-native";
import logo from "@/assets/icon.png";
import { Button } from "@/components/ui/button";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export default function DrawerLayout() {
  const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light.colors,
  };
  const tabIcon = (
    focused: boolean,
    active: IoniconName,
    inactive: IoniconName,
    size: number,
    color: string
  ) => (
    <Ionicons
      name={focused ? active : inactive}
      size={focused ? size + 2 : size}
      color={color}
    />
  );

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: LIGHT_THEME.colors.primary,
        drawerInactiveTintColor: THEME.light.mutedForeground,
        drawerActiveBackgroundColor: THEME.light.muted,
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: "500",
        },
        drawerType: "slide",
        swipeEdgeWidth: 80,
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          <View className="font-poppinsBold items-center border-b border-gray-200 py-6">
            <Image
              source={logo}
              className="w-16 h-16 rounded-full mb-2"
            />
            <Text className="text-lg font-bold">Crop AI</Text>
          </View>

          <View className="mt-4 flex-1 font-poppinsRegular">
            <DrawerItemList {...props} />
          </View>

          <View className="border-t border-gray-200 px-4 py-3">
            <TouchableOpacity
              onPress={async () => {
                try {
                  console.log("User signed out");
                } catch (err) {
                  console.error("Logout failed:", err);
                }
              }}
            >
              <View className="flex flex-row mx-auto items-center space-x-2">
                <Ionicons size={20} name="log-out" className="text-red-900" />
                <Text className="text-red-500 font-medium text-base">Logout</Text>
              </View>
            </TouchableOpacity>
          </View>

        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Chat",
          drawerIcon: ({ focused, color, size }) =>
            tabIcon(focused, "chatbubble", "chatbubble-outline", size, color),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerItemStyle: { display: "contents" },
          drawerIcon: ({ focused, color, size }) =>
            tabIcon(focused, "person", "person-outline", size, color),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: "About",
          drawerItemStyle: { display: "contents" },
          drawerIcon: ({ focused, color, size }) =>
            tabIcon(focused, "information-circle", "information-circle-outline", size, color),
        }}
      />
      <Drawer.Screen
        name="chat/[id]"
        options={{
          title: "History",
          drawerItemStyle: { display: "none" },
          drawerIcon: ({ focused, color, size }) =>
            tabIcon(focused, "time", "time-outline", size, color),
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: false,
          drawerItemStyle: { display: "none" },
          drawerIcon: ({ focused, color, size }) =>
            tabIcon(focused, "log-in", "log-in-outline", size, color),
        }}
      />
    </Drawer>
  );
}

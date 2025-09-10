import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Drawer from "expo-router/drawer";
import type { ComponentProps } from "react";
import { Image, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import logo from "@/assets/icon.png";
import { Redirect, Slot, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'


type IoniconName = ComponentProps<typeof Ionicons>["name"];

export default function DrawerLayout() {
  const tabIcon = (
    focused: boolean,
    active: IoniconName,
    inactive: IoniconName,
    size: number,
    color: string,
  ) => (
    <Ionicons
      name={focused ? active : inactive}
      size={focused ? size + 2 : size}
      color={color}
    />
  );
  const { isSignedIn } = useAuth()

  // if (!isSignedIn) {
  //   return <Redirect href={'/(auth)/login'} />
  // }

  return (
    <Drawer
      screenOptions={{
        drawerActiveTintColor: "#0f766e",
        drawerInactiveTintColor: "#64748b",
        drawerLabelStyle: {
          fontFamily: "Poppins_500Medium",
          fontSize: 15,
          fontWeight: 600,
        },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} className="bg-background">
          <View className="items-center border-border border-b py-6">
            <Image source={logo} className="mb-3 h-16 w-16 rounded-full" />
            <Text className="font-poppinsBold text-lg">Crop AI</Text>
          </View>

          <View className="mt-4 px-2">
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
      name="chat/index"
      options={{
        title: "Chats",
        drawerIcon: ({ focused, color, size }) =>
        tabIcon(
          focused,
          "chatbubble-sharp",
          "chatbubble-outline",
          size,
          color,
        ),
      }}
      />

      <Drawer.Screen
      name="chat/[id]"
      options={{
        drawerItemStyle: { display: "none" },
      }}
      />

      <Drawer.Screen
      name="profile"
      options={{
        title: "Profile",
        drawerIcon: ({ focused, color, size }) =>
        tabIcon(focused, "person", "person-outline", size, color),
      }}
      />

      <Drawer.Screen
      name="settings"
      options={{
        title: "Settings",
        drawerIcon: ({ focused, color, size }) =>
        tabIcon(focused, "settings-sharp", "settings-outline", size, color),
      }}
      />

    </Drawer>
  );
}

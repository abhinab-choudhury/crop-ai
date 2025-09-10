import * as React from "react";
import { View } from "react-native";
import { toast } from "sonner-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Container } from "@/components/container";
import { SignOutButton } from "../components/SignOutButton";

export default function Settings() {
    return (
        <Container className="flex-1 items-center justify-center px-6">
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent className="gap-4">
                    <Text className="text-base text-foreground">
                        Manage your account and preferences
                    </Text>

                    <SignOutButton />
                </CardContent>
            </Card>
        </Container>
    );
}

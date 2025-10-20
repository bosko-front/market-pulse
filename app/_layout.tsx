import React from "react";
import AppProvider from "../src/AppProvider";
import { Stack} from "expo-router";

export default function RootLayout() {

    return (
        <AppProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: "slide_from_bottom",
                }}
            />
        </AppProvider>
    );
}

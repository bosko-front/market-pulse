import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Market Pulse 👋</Text>
            <Text style={styles.subtitle}>
                Track global stocks and manage your portfolio effortlessly.
            </Text>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push("/(tabs)/markets")}
            >
                <Text style={styles.buttonText}>Enter App</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B0C10",
        padding: 20,
    },
    title: { fontSize: 26, fontWeight: "700", color: "#fff", marginBottom: 8 },
    subtitle: { fontSize: 16, color: "#A1A1AA", marginBottom: 24, textAlign: "center" },
    button: {
        backgroundColor: "#10B981",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

import { View, Text, StyleSheet } from "react-native";

export default function AddPositionScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Add new stock position</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0B0C10", justifyContent: "center", alignItems: "center" },
    text: { color: "#fff", fontSize: 18 },
});

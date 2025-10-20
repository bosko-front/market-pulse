import React, { useEffect, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/src/constants/colors";

interface Props {
    isFetching: boolean;
}

export function LastUpdated({ isFetching }: Props) {
    const [timestamp, setTimestamp] = useState(new Date());
    const [flashAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (isFetching) {
            setTimestamp(new Date());

            // brief flash animation
            Animated.sequence([
                Animated.timing(flashAnim, {
                    toValue: 0.3,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(flashAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isFetching]);

    const timeStr = timestamp.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <Animated.View style={[styles.container, { opacity: flashAnim }]}>
            <Text style={styles.text}>Last updated {timeStr}</Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
    },
    text: {
        color: Colors.onGradientTextMuted,
        fontSize: 12,
    },
});

// src/constants/colors.ts

export const Colors = {
    // Base
    background: "#0B0C10",
    surface: "#1F2937",
    border: "#2D3748",

    tabBarBg: "rgba(2,6,23,0.55)",       // translucent near-black
    tabBarInactive: "rgba(255,255,255,0.72)",
    tabBarActive: "#6366F1",

    // Text
    textPrimary: "#F3F4F6",
    textSecondary: "#9CA3AF",
    textMuted: "#6B7280",
    onGradientTextPrimary: "#FFFFFF",
    onGradientTextSecondary: "rgba(255,255,255,0.82)",
    onGradientTextMuted: "rgba(255,255,255,0.64)",

    // Brand (updated)
    brandPrimary: "#6366F1", // indigo
    brandSecondary: "#0EA5E9", // cyan
    brandGradient: ["#6366F1", "#0EA5E9"] as const, // for gradients

    // Finance colors
    success: "#22C55E",
    error: "#EF4444",
    warning: "#F59E0B",

    // Chart
    chartLine: "#6366F1",
    chartGrid: "#374151",

    // Buttons
    buttonPrimary: "#6366F1",
    buttonPrimaryText: "#FFFFFF",

    // Misc
    overlay: "rgba(0,0,0,0.5)",
    shadow: "rgba(0,0,0,0.25)",
};

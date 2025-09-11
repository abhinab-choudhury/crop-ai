import { DefaultTheme, DarkTheme, type Theme } from "@react-navigation/native";

export const THEME = {
  light: {
    background: "hsl(0 0% 100%)", // white
    foreground: "hsl(222.2 47.4% 11.2%)", // almost black text
    card: "hsl(0 0% 100%)", // white
    cardForeground: "hsl(222.2 47.4% 11.2%)",

    primary: "hsl(174 72% 28%)", // teal-700
    primaryForeground: "hsl(0 0% 100%)",

    secondary: "hsl(173 58% 39%)", // teal-600
    secondaryForeground: "hsl(0 0% 100%)",

    muted: "hsl(0 0% 96.1%)",
    mutedForeground: "hsl(0 0% 45.1%)",

    accent: "hsl(173 58% 39%)", // same teal as secondary
    accentForeground: "hsl(0 0% 100%)",

    destructive: "hsl(0 84.2% 60.2%)", // red
    border: "hsl(0 0% 89.8%)",
    input: "hsl(0 0% 89.8%)",
    ring: "hsl(174 72% 28%)", // teal ring
    radius: "0.625rem",
  },

  dark: {
    background: "hsl(222.2 47.4% 11.2%)", // deep gray/black
    foreground: "hsl(210 40% 98%)", // near white text
    card: "hsl(222.2 47.4% 13%)", // slightly lighter than bg
    cardForeground: "hsl(210 40% 98%)",

    primary: "hsl(174 72% 45%)", // brighter teal for contrast
    primaryForeground: "hsl(0 0% 100%)",

    secondary: "hsl(173 58% 39%)", // teal-600 still works on dark
    secondaryForeground: "hsl(0 0% 100%)",

    muted: "hsl(217.2 32.6% 17.5%)", // muted gray
    mutedForeground: "hsl(215 20.2% 65.1%)",

    accent: "hsl(173 58% 39%)",
    accentForeground: "hsl(0 0% 100%)",

    destructive: "hsl(0 62.8% 30.6%)", // darker red
    border: "hsl(217.2 32.6% 17.5%)",
    input: "hsl(217.2 32.6% 17.5%)",
    ring: "hsl(174 72% 45%)",
    radius: "0.625rem",
  },
};

export const NAV_THEME = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
} satisfies Record<"light" | "dark", Theme>;

export const LIGHT_THEME: Theme = NAV_THEME.light;
export const DARK_THEME: Theme = NAV_THEME.dark;

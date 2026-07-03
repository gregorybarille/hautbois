// Shared palette for the instrument fingering charts so all instruments
// use the same pressed/open visual language.
export const PRESSED_COLOR = "#8B5CF6"; // violet

export interface ChartTheme {
  pressed: string;
  keyWhite: string;
  keyBorder: string;
  text: string;
  legendBg: string;
  legendBorder: string;
}

export const chartTheme = (darkMode: boolean): ChartTheme => ({
  pressed: PRESSED_COLOR,
  keyWhite: darkMode ? "#e5e5e5" : "#FFFFFF",
  keyBorder: darkMode ? "#666666" : "#888888",
  text: darkMode ? "#e5e5e5" : "#4B5563",
  legendBg: darkMode ? "#1a1a1a" : "#F9FAFB",
  legendBorder: darkMode ? "#374151" : "#E5E7EB",
});

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
  keyWhite: darkMode ? "#e2e8f0" : "#f8fafc", // slate-200 / slate-50
  keyBorder: darkMode ? "#64748b" : "#94a3b8", // slate-500 / slate-400
  text: darkMode ? "#e2e8f0" : "#475569", // slate-200 / slate-600
  legendBg: darkMode ? "#0f172a" : "#f8fafc", // slate-900 / slate-50
  legendBorder: darkMode ? "#334155" : "#e2e8f0", // slate-700 / slate-200
});

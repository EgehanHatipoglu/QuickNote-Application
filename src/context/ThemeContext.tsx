import React, { createContext, useContext, useState, ReactNode } from 'react';

// ── Palette shape ──────────────────────────────────────────────────
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  success: string;
  warning: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSub: string;
  textMuted: string;
  border: string;
  dangerBg: string;
}

// ── Light palette ──────────────────────────────────────────────────
export const LightColors: ThemeColors = {
  primary:      '#6C63FF',
  primaryLight: '#E4E2FF',
  primaryDark:  '#4B40DF',
  accent:       '#FF6D80',
  success:      '#33C78E',
  warning:      '#FFBA33',
  bg:           '#F6F6F9',
  surface:      '#FFFFFF',
  surfaceAlt:   '#F8F7FF',
  text:         '#1A192E',
  textSub:      '#6B6B7D',
  textMuted:    '#B3B2BA',
  border:       '#E5E4EA',
  dangerBg:     '#FFF2F3',
};

// ── Dark palette ───────────────────────────────────────────────────
export const DarkColors: ThemeColors = {
  primary:      '#8680FF',
  primaryLight: '#23205A',
  primaryDark:  '#5A51EF',
  accent:       '#FF7A90',
  success:      '#3DDBAA',
  warning:      '#FFB84D',
  bg:           '#0E0E1A',
  surface:      '#18182C',
  surfaceAlt:   '#21213A',
  text:         '#EAE9F8',
  textSub:      '#9998AC',
  textMuted:    '#56556A',
  border:       '#2B2A3F',
  dangerBg:     '#2E1520',
};

// ── Context ────────────────────────────────────────────────────────
interface ThemeContextType {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  colors:      LightColors,
  isDark:      false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  return (
    <ThemeContext.Provider
      value={{
        colors:      isDark ? DarkColors : LightColors,
        isDark,
        toggleTheme: () => setIsDark(prev => !prev),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

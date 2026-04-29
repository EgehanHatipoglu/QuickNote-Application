// Static design tokens — colors are now in ThemeContext
// Keep LightColors here for reference / non-hook usage (e.g. typing)
export { LightColors as Colors, DarkColors } from '../context/ThemeContext';
export type { ThemeColors } from '../context/ThemeContext';

export const Typography = {
  heading: { fontSize: 26, fontWeight: '700' as const },
  title:   { fontSize: 17, fontWeight: '600' as const },
  body:    { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  tiny:    { fontSize: 10, fontWeight: '400' as const },
};

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Shadow = {
  card: {
    shadowColor:   '#1A192E',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius:  12,
    elevation:     3,
  },
  fab: {
    shadowColor:   '#6C63FF',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius:  20,
    elevation:     10,
  },
  button: {
    shadowColor:   '#6C63FF',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius:  14,
    elevation:     6,
  },
};

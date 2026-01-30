import { TextStyle } from 'react-native';

const typography = {
  h1: { fontSize: 32, fontWeight: '900', letterSpacing: -0.5 } as TextStyle,
  h2: { fontSize: 22, fontWeight: '800', letterSpacing: -0.2 } as TextStyle,
  h3: { fontSize: 16, fontWeight: '800', letterSpacing: -0.1 } as TextStyle,
  body: { fontSize: 14, fontWeight: '500', letterSpacing: 0 } as TextStyle,
  caption: { fontSize: 12, fontWeight: '600', letterSpacing: 0.2 } as TextStyle,
};

export const theme = {
  // legacy top-level aliases
  bg: '#07070A',
  panel: 'rgba(18,18,26,0.72)',
  panelHard: '#12121A',
  text: '#F5F5F7',
  muted: 'rgba(245,245,247,0.70)',
  line: 'rgba(255,255,255,0.08)',

  gold: '#D7B46A',
  brandAccent: '#B537F2',

  colors: {
    // app chrome
    bg: '#07070A',
    cardBg: 'rgba(18,18,26,0.72)',
    text: '#F5F5F7',
    textSecondary: 'rgba(245,245,247,0.70)',
    line: 'rgba(255,255,255,0.08)',

    // neon palette
    neonBlue: '#00F0FF',
    neonPurple: '#B537F2',
    neonPink: '#FF006E',
    neonGreen: '#39FF14',
    neonOrange: '#FF5E00',

    // semantic
    accent: '#B537F2',
    success: '#34C759',
    danger: '#EF4444',
    warning: '#F59E0B',

    // glass helpers
    glassDark: 'rgba(20, 20, 40, 0.7)',
    glassLight: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },


  animation: {
    duration: {
      fast: 180,
      normal: 280,
      slow: 520,
    },
  },

  typography,
};

export type Theme = typeof theme;

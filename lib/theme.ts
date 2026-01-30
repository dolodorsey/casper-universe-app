// Neon/Glass Design System Theme
export const theme = {
  colors: {
    // Neon colors
    neonBlue: '#00F0FF',
    neonPurple: '#B537F2',
    neonPink: '#FF006E',
    neonGreen: '#39FF14',
    neonOrange: '#FF5E00',

    // Glass backgrounds
    glassDark: 'rgba(20, 20, 40, 0.7)',
    glassLight: 'rgba(255, 255, 255, 0.1)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',

    // Gradients
    gradientPrimary: ['#B537F2', '#00F0FF'],
    gradientSecondary: ['#FF006E', '#FF5E00'],

    // Base colors
    background: '#0A0A1E',
    surface: '#1A1A3E',
    text: '#FFFFFF',
    textSecondary: '#A0A0C0',
  },

  shadows: {
    neon: {
      blue: '0 0 20px rgba(0, 240, 255, 0.5)',
      purple: '0 0 20px rgba(181, 55, 242, 0.5)',
      pink: '0 0 20px rgba(255, 0, 110, 0.5)',
      green: '0 0 20px rgba(57, 255, 20, 0.5)',
    },
    glass: '0 8px 32px rgba(0, 0, 0, 0.37)',
  },

  blur: {
    glass: 'blur(10px)',
    strong: 'blur(20px)',
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
    xxl: 48,
  },

  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  typography: {
    h1: { fontSize: 32, fontWeight: '700' },
    h2: { fontSize: 24, fontWeight: '600' },
    body: { fontSize: 16, fontWeight: '400' },
    caption: { fontSize: 12, fontWeight: '400' },
  },
};

// Aliases for compatibility
// @ts-ignore
theme.colors.accent = theme.colors.neonPurple;
// @ts-ignore
theme.colors.cardBg = theme.colors.glassDark;
// @ts-ignore
theme.colors.bg = theme.colors.background;

export type Theme = typeof theme;

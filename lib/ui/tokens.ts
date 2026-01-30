export const tokens = {
    spacing: { xs: 6, sm: 10, md: 16, lg: 24, xl: 32, xxl: 44 },
    radius: { sm: 14, md: 18, lg: 26, xl: 34 },
    border: { hairline: 1 },
    blur: { low: 18, high: 28 },
    shadow: {
        soft: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
        lift: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 10 }, elevation: 10 },
    },
    colors: {
        bg0: '#07070A',
        bg1: '#0B0B12',
        surface0: 'rgba(255,255,255,0.06)',
        surface1: 'rgba(255,255,255,0.10)',
        line: 'rgba(255,255,255,0.10)',
        text0: '#FFFFFF',
        text1: 'rgba(255,255,255,0.82)',
        muted: 'rgba(255,255,255,0.62)',
        gold: '#F5C542',
        neon: '#6DFFB8',
        danger: '#FF5A5F',
    },
} as const;

import { tokens } from './tokens';

export const type = {
    display: { fontSize: 34, fontWeight: '800', color: tokens.colors.text0, letterSpacing: -0.5 },
    h1: { fontSize: 26, fontWeight: '800', color: tokens.colors.text0, letterSpacing: -0.3 },
    h2: { fontSize: 20, fontWeight: '800', color: tokens.colors.text0 },
    h3: { fontSize: 16, fontWeight: '700', color: tokens.colors.text0 },
    body: { fontSize: 15, fontWeight: '500', color: tokens.colors.text1, lineHeight: 20 },
    bodyBold: { fontSize: 15, fontWeight: '800', color: tokens.colors.text0 },
    caption: { fontSize: 12, fontWeight: '600', color: tokens.colors.muted },
    mono: { fontSize: 12, fontWeight: '700', color: tokens.colors.text1, letterSpacing: 0.5 },
} as const;

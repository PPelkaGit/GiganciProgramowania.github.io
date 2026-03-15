export const Colors = {
  // Brand
  primary: '#6C3CE1',       // Purple - main brand
  primaryLight: '#8B5CF6',
  primaryDark: '#4C1D95',
  secondary: '#F59E0B',     // Amber - accent
  secondaryLight: '#FCD34D',

  // Backgrounds
  bg: '#F8F7FF',
  bgCard: '#FFFFFF',
  bgDark: '#1E1B4B',

  // Text
  textPrimary: '#1E1B4B',
  textSecondary: '#6B7280',
  textLight: '#FFFFFF',
  textMuted: '#9CA3AF',

  // Roles
  student: '#6C3CE1',
  parent: '#059669',
  teacher: '#DC2626',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // UI
  border: '#E5E7EB',
  shadow: 'rgba(108, 60, 225, 0.15)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const Typography = {
  hero: { fontSize: 32, fontWeight: '800' as const, lineHeight: 40 },
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '700' as const, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  small: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  smallBold: { fontSize: 13, fontWeight: '600' as const, lineHeight: 18 },
  tiny: { fontSize: 11, fontWeight: '400' as const, lineHeight: 16 },
};

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 24, round: 999,
};

export const Shadow = {
  card: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
};

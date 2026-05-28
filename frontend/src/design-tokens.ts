/**
 * Design Tokens - Centralized design system constants
 * Used across the application for consistent styling
 */

export const COLORS = {
  primary: "#007AFF",
  background: "#F5F6FA",
  surface: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  border: "#F3F4F6",
  success: "#10B981",
  warning: "#F59E0B",
} as const;

export const TYPOGRAPHY = {
  small: {
    fontSize: "12px",
    fontWeight: 500,
  },
  body: {
    fontSize: "15px",
    fontWeight: 400,
  },
  subtitle: {
    fontSize: "18px",
    fontWeight: 600,
  },
  heading: {
    fontSize: "20px",
    fontWeight: 700,
  },
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  xxl: "24px",
} as const;

export const BORDER_RADIUS = {
  small: "8px",
  medium: "10px",
  large: "12px",
} as const;

export const SHADOWS = {
  light: "0 2px 4px rgba(0, 0, 0, 0.1)",
  card: "0 2px 8px rgba(0, 0, 0, 0.08)",
} as const;

export const COMPONENT_DEFAULTS = {
  button: {
    padding: "12px 16px",
    borderRadius: "10px",
    fontWeight: 600,
    fontSize: "15px",
  },
  card: {
    padding: "16px",
    borderRadius: "12px",
    shadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
} as const;

// Type exports for better TypeScript support
export type ColorKey = keyof typeof COLORS;
export type TypographyKey = keyof typeof TYPOGRAPHY;
export type SpacingKey = keyof typeof SPACING;
export type BorderRadiusKey = keyof typeof BORDER_RADIUS;
export type ShadowKey = keyof typeof SHADOWS;

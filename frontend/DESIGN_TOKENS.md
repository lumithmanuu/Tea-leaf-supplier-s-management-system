# Design Tokens Usage Guide

This document explains how to use the design tokens in your Tea Leaf Management System frontend.

## Overview

Design tokens are centralized, reusable values for colors, typography, spacing, and other design elements. They ensure consistency across the application and make it easy to update styles globally.

## Files

- **`design-tokens.ts`** - TypeScript constants for programmatic access
- **`design-tokens.css`** - CSS variables and utility classes
- **`main.jsx`** - Imports design-tokens.css for global availability

## Using Design Tokens

### 1. Using CSS Variables

In your CSS/stylesheets, use CSS custom properties (variables):

```css
.my-component {
  color: var(--dt-color-text-primary);
  background: var(--dt-color-surface);
  padding: var(--dt-space-lg);
  border-radius: var(--dt-radius-medium);
  box-shadow: var(--dt-shadow-card);
}
```

### 2. Using TypeScript Constants

In your React components or JavaScript:

```typescript
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from './design-tokens'

// Use in inline styles
const buttonStyle = {
  backgroundColor: COLORS.primary,
  padding: `${SPACING.md} ${SPACING.lg}`,
  borderRadius: BORDER_RADIUS.medium,
  fontSize: TYPOGRAPHY.body.fontSize,
  fontWeight: TYPOGRAPHY.body.fontWeight,
}

// Or access individual values
const primaryColor = COLORS.primary // "#007AFF"
const spacing = SPACING.lg // "16px"
```

### 3. Using Utility Classes

Apply pre-built utility classes directly in your JSX:

```jsx
<div className="dt-card dt-shadow-card">
  <h1 className="dt-text-heading dt-text-primary">Title</h1>
  <p className="dt-text-body dt-text-secondary">Content</p>
  <button className="dt-button dt-button-primary">Click me</button>
</div>
```

## Available Tokens

### Colors
- `--dt-color-primary` - Primary brand color (#007AFF)
- `--dt-color-background` - App background (#F5F6FA)
- `--dt-color-surface` - Card/component background (#FFFFFF)
- `--dt-color-text-primary` - Primary text (#1A1A1A)
- `--dt-color-text-secondary` - Secondary text (#6B7280)
- `--dt-color-border` - Border color (#F3F4F6)
- `--dt-color-success` - Success state (#10B981)
- `--dt-color-warning` - Warning state (#F59E0B)

### Typography
- **Sizes:** `--dt-text-sm` (12px), `--dt-text-body` (15px), `--dt-text-subtitle` (18px), `--dt-text-heading` (20px)
- **Weights:** `--dt-font-weight-small` (500), `--dt-font-weight-body` (400), `--dt-font-weight-subtitle` (600), `--dt-font-weight-heading` (700)
- **Classes:** `.dt-text-sm`, `.dt-text-body`, `.dt-text-subtitle`, `.dt-text-heading`

### Spacing
- `--dt-space-xs` (4px)
- `--dt-space-sm` (8px)
- `--dt-space-md` (12px)
- `--dt-space-lg` (16px)
- `--dt-space-xl` (20px)
- `--dt-space-xxl` (24px)

**Padding classes:** `.dt-p-xs`, `.dt-p-sm`, `.dt-p-md`, `.dt-p-lg`, `.dt-p-xl`, `.dt-p-xxl`
**Gap classes:** `.dt-gap-xs`, `.dt-gap-sm`, `.dt-gap-md`, `.dt-gap-lg`, `.dt-gap-xl`, `.dt-gap-xxl`

### Border Radius
- `--dt-radius-small` (8px)
- `--dt-radius-medium` (10px)
- `--dt-radius-large` (12px)

**Classes:** `.dt-rounded-small`, `.dt-rounded-medium`, `.dt-rounded-large`

### Shadows
- `--dt-shadow-light` - Light shadow
- `--dt-shadow-card` - Card shadow

**Classes:** `.dt-shadow-light`, `.dt-shadow-card`

## Component Examples

### Button
```jsx
<button className="dt-button dt-button-primary">
  Primary Button
</button>
```

### Card
```jsx
<div className="dt-card">
  <h2 className="dt-text-heading">Card Title</h2>
  <p className="dt-text-body">Card content goes here</p>
</div>
```

### Flex Layout with Spacing
```jsx
<div style={{ display: 'flex', gap: `var(--dt-space-lg)` }}>
  <div className="dt-p-md dt-text-body">Item 1</div>
  <div className="dt-p-md dt-text-body">Item 2</div>
</div>
```

## Type Safety (TypeScript)

The design-tokens.ts exports type definitions for better IDE support:

```typescript
import type { ColorKey, TypographyKey, SpacingKey } from './design-tokens'

// This gives you autocomplete and type checking
const color: ColorKey = 'primary' // ✓ Valid
// const color: ColorKey = 'invalid' // ✗ TypeScript error
```

## Best Practices

1. **Always use design tokens** - Don't hardcode colors or spacing values
2. **Use CSS variables in CSS** - Better performance and easier theme switching
3. **Use TypeScript constants in JS** - Better type safety and IDE support
4. **Use utility classes for common patterns** - Faster development, consistent styling
5. **Document custom colors** - If you add colors not in tokens, document them

## Extending Tokens

To add new tokens, edit both files:

1. Update `design-tokens.ts` with new constants
2. Update `design-tokens.css` with new CSS variables
3. Add corresponding utility classes if needed

Example:
```typescript
// design-tokens.ts
export const COLORS = {
  // ... existing colors
  customColor: "#FF0000",
}
```

```css
/* design-tokens.css */
:root {
  /* ... existing variables */
  --dt-color-custom: #FF0000;
}
```

## Color Scheme Note

The existing project has its own color scheme (tea-themed greens and golds) in `index.css`. The design tokens provide a separate, modern color palette. You can:

- Use design tokens for new components
- Gradually migrate old components to design tokens
- Combine both systems (use design tokens + existing variables as needed)

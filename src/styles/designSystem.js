// src/styles/designSystem.js

import { createGlobalStyle } from 'styled-components';

// Color palette
const colors = {
  primary: '#3B82F6', // Blue
  secondary: '#10B981', // Green
  accent: '#F59E0B', // Yellow
  background: '#F3F4F6', // Light gray
  text: {
    primary: '#1F2937', // Dark gray
    secondary: '#6B7280', // Medium gray
  },
  white: '#FFFFFF',
  black: '#000000',
};

// Typography
const typography = {
  fontFamily: "'Inter', sans-serif",
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Spacing
const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
};

// Breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
};

// Global styles
const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSize.base};
    color: ${colors.text.primary};
    background-color: ${colors.background};
    line-height: 1.5;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: ${typography.fontWeight.bold};
    margin-bottom: ${spacing.md};
  }

  h1 { font-size: ${typography.fontSize['4xl']}; }
  h2 { font-size: ${typography.fontSize['3xl']}; }
  h3 { font-size: ${typography.fontSize['2xl']}; }
  h4 { font-size: ${typography.fontSize.xl}; }
  h5 { font-size: ${typography.fontSize.lg}; }
  h6 { font-size: ${typography.fontSize.base}; }
`;

// Component styles
const componentStyles = {
  button: `
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typography.fontSize.base};
    font-weight: ${typography.fontWeight.medium};
    border-radius: 0.25rem;
    transition: background-color 0.3s ease;
  `,
  card: `
    background-color: ${colors.white};
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    padding: ${spacing.lg};
  `,
  input: `
    width: 100%;
    padding: ${spacing.sm} ${spacing.md};
    font-size: ${typography.fontSize.base};
    border: 1px solid ${colors.text.secondary};
    border-radius: 0.25rem;
    transition: border-color 0.3s ease;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }
  `,
};

export {
  colors,
  typography,
  spacing,
  breakpoints,
  GlobalStyle,
  componentStyles,
};
// Punjab & Sind Bank Official Color Scheme
export const PSBColors = {
  // Primary PSB Colors
  primary: '#00563F',        // PSB Green
  primaryLight: '#00704F',   // Lighter PSB Green
  primaryDark: '#003D2E',    // Darker PSB Green
  
  // Secondary Colors
  secondary: '#FFD700',      // Golden Yellow
  secondaryLight: '#FFED4E', // Light Golden
  secondaryDark: '#E6C200',  // Dark Golden
  
  // Base Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Neutral Colors
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Status Colors (PSB themed)
  success: '#00563F',        // PSB Green for success
  warning: '#FFD700',        // Golden for warnings
  error: '#DC2626',          // Red for errors
  info: '#2563EB',           // Blue for info
  
  // Background Gradients
  gradients: {
    primary: ['#00563F', '#00704F'],
    secondary: ['#FFD700', '#FFED4E'],
    neutral: ['#F9FAFB', '#F3F4F6'],
    dark: ['#1F2937', '#374151'],
  },
  
  // Text Colors
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
    white: '#FFFFFF',
    accent: '#00563F',
  },
  
  // Component Specific
  card: {
    background: '#FFFFFF',
    border: '#E5E7EB',
    shadow: 'rgba(0, 86, 63, 0.1)',
  },
  
  button: {
    primary: '#00563F',
    primaryHover: '#00704F',
    secondary: '#FFD700',
    secondaryHover: '#E6C200',
    disabled: '#9CA3AF',
  },
  
  // Banking specific colors
  banking: {
    secure: '#00563F',
    transaction: '#FFD700',
    balance: '#059669',
    debit: '#DC2626',
    credit: '#059669',
  }
};

// Theme configuration for light and dark modes
export const createTheme = (isDark: boolean = false) => ({
  isDark,
  colors: {
    // Background colors
    background: isDark ? ['#1F2937', '#374151'] : ['#F9FAFB', '#FFFFFF'],
    surface: isDark ? 'rgba(255, 255, 255, 0.05)' : PSBColors.white,
    card: isDark ? 'rgba(255, 255, 255, 0.05)' : PSBColors.card.background,
    
    // Text colors
    text: isDark ? PSBColors.text.white : PSBColors.text.primary,
    textSecondary: isDark ? PSBColors.gray[300] : PSBColors.text.secondary,
    
    // Primary colors (always PSB themed)
    primary: PSBColors.primary,
    primaryLight: PSBColors.primaryLight,
    secondary: PSBColors.secondary,
    
    // Status colors
    success: PSBColors.success,
    warning: PSBColors.warning,
    error: PSBColors.error,
    info: PSBColors.info,
    
    // UI elements
    border: isDark ? PSBColors.gray[600] : PSBColors.card.border,
    icon: isDark ? PSBColors.gray[300] : PSBColors.gray[600],
    shadow: PSBColors.card.shadow,
    
    // Banking specific
    secure: PSBColors.banking.secure,
    transaction: PSBColors.banking.transaction,
  },
});

export default PSBColors;
import { createTheme } from '@mui/material/styles';
import { PaletteOptions, TypographyVariantsOptions, Components, Theme } from '@mui/material';

// Paleta oficial
export const palette = {
  primary: {
    main: '#0A2540',
    light: '#1A3550',
    dark: '#041830',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#000000',
    light: '#212121',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#0A2540',
    secondary: '#4A5568',
    disabled: '#A0AEC0',
  },
  neutral: {
    main: '#F5F5F5',
    light: '#FAFAFA',
    dark: '#E0E0E0',
  },
  success: {
    main: '#00B37E',
    light: '#3DD598',
    dark: '#009D69',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#F75A68',
    light: '#FF7A85',
    dark: '#E03A48',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3182CE',
    light: '#4299E1',
    dark: '#2B6CB0',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F6AD55',
    light: '#FBD38D',
    dark: '#ED8936',
    contrastText: '#FFFFFF',
  },
  divider: 'rgba(0, 0, 0, 0.1)',
};

// Sistema de espaçamento baseado em 8px
const spacing = (factor: number) => `${8 * factor}px`;

// Definições de tipografia
const typography: TypographyVariantsOptions = {
  fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
  h1: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.005em',
  },
  h3: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0em',
  },
  h4: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em',
  },
  h5: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0em',
  },
  h6: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  body1: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  body2: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0em',
  },
  button: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.025em',
    textTransform: 'none' as const,
  },
};

// Personalização de componentes
const components: Components<Omit<Theme, 'components'>> = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: spacing(3), // 24px
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        padding: '10px 24px',
        boxShadow: 'none',
        textTransform: 'none' as const,
        fontWeight: 600,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          transform: 'translateY(-2px)',
        },
      },
      contained: {
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
      },
      outlined: {
        borderWidth: '1px',
        '&:hover': {
          borderWidth: '1px',
        },
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          '& fieldset': {
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderWidth: '1px',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-outlined': {
          transform: 'translate(14px, 16px) scale(1)',
        },
        '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
          transform: 'translate(14px, -6px) scale(0.75)',
        },
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      outlined: {
        borderRadius: '8px',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: spacing(2), // 16px
      },
      head: {
        fontWeight: 600,
        backgroundColor: palette.neutral.light,
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        fontWeight: 500,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: '16px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: spacing(3), // 24px
      },
    },
  },
};

// Breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
  },
};

// Criar e exportar o tema
const theme = createTheme({
  palette: palette as PaletteOptions,
  typography,
  spacing: (factor: number) => spacing(factor),
  components,
  breakpoints,
  shape: {
    borderRadius: 8,
  },
});

export default theme; 
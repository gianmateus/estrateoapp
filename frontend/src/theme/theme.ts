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
  grey: {
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
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

// Sistema de espaçamento
const spacing = 4;

// Definições de tipografia
const typography: TypographyVariantsOptions = {
  fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
  h1: {
    fontSize: '48px',
    fontWeight: 600,
    lineHeight: '56px',
    letterSpacing: '-0.01em',
  },
  h2: {
    fontSize: '32px',
    fontWeight: 600,
    lineHeight: '40px',
    letterSpacing: '-0.005em',
  },
  h3: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: '32px',
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
    lineHeight: '24px',
    letterSpacing: '0em',
  },
  body2: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: '20px',
    letterSpacing: '0em',
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: '16px',
    letterSpacing: '0em',
  },
  button: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: '20px',
    letterSpacing: '0.025em',
    textTransform: 'none' as const,
  },
};

// Personalização de componentes
const components: Components<Omit<Theme, 'components'>> = {
  MuiCssBaseline: {
    styleOverrides: `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ.woff2') format('woff2');
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ.woff2') format('woff2');
      }
      .section {
        margin-block: 32px;
      }
    `,
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        padding: 24,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        boxShadow: 'none',
        textTransform: 'none' as const,
        fontWeight: 600,
        transition: 'all 0.2s ease-in-out',
      },
      contained: {
        boxShadow: 'none',
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
          borderRadius: 8,
          '& fieldset': {
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderWidth: '1px',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '2px',
            borderColor: palette.primary.main,
          },
        },
        '& .MuiInputLabel-outlined': {
          transform: 'translate(14px, 16px) scale(1)',
          color: palette.grey[600],
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
        borderRadius: 8,
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: palette.primary.main,
        '& .MuiTableCell-head': {
          color: '#FFFFFF',
          fontWeight: 600,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: 16,
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: 24,
      },
    },
  },
};

// Breakpoints para responsividade
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 768,
    lg: 1280,
    xl: 1920,
  },
};

// Criar e exportar o tema
const theme = createTheme({
  palette,
  typography,
  spacing,
  components,
  breakpoints,
});

export default theme; 
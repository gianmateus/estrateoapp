import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

interface PremiumThemeProviderProps {
  children: React.ReactNode;
}

const PremiumThemeProvider: React.FC<PremiumThemeProviderProps> = ({ children }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default PremiumThemeProvider; 
import React from 'react';
import { render, screen } from '@testing-library/react';
import TaxCard from './TaxCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock do tema para testes
const theme = createTheme();

describe('TaxCard Component', () => {
  test('renders title correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <TaxCard 
          title="Test Title" 
          value={1000} 
          icon="vat"
        />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  
  test('renders formatted value when value > 0', () => {
    render(
      <ThemeProvider theme={theme}>
        <TaxCard 
          title="Test Title" 
          value={1000} 
          icon="vat"
        />
      </ThemeProvider>
    );
    
    // Verifica se o valor foi formatado corretamente (€1.000,00)
    expect(screen.getByText(/€.*1.*000/)).toBeInTheDocument();
  });
  
  test('renders dash when value is 0', () => {
    render(
      <ThemeProvider theme={theme}>
        <TaxCard 
          title="Test Title" 
          value={0} 
          icon="vat"
        />
      </ThemeProvider>
    );
    
    // Verifica se exibe o traço (—) para valor zero
    expect(screen.getByText('—')).toBeInTheDocument();
  });
  
  test('renders dash when value is undefined', () => {
    render(
      <ThemeProvider theme={theme}>
        <TaxCard 
          title="Test Title" 
          value={undefined} 
          icon="vat"
        />
      </ThemeProvider>
    );
    
    // Verifica se exibe o traço (—) para valor indefinido
    expect(screen.getByText('—')).toBeInTheDocument();
  });
  
  test('shows skeleton when loading', () => {
    render(
      <ThemeProvider theme={theme}>
        <TaxCard 
          title="Test Title" 
          value={1000} 
          icon="vat"
          isLoading={true}
        />
      </ThemeProvider>
    );
    
    // Verifica se o skeleton é exibido quando isLoading=true
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
}); 
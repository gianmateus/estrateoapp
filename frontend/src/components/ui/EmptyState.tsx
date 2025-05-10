import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface EmptyStateProps {
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ message = 'Sem dados no período' }) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2
      }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM65 85H55V75H65V85ZM65 65H55V35H65V65Z"
          fill={theme.palette.grey[400]}
          opacity={0.6}
        />
      </svg>
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mt: 2, textAlign: 'center' }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState; 
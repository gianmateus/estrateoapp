import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, useTheme, SxProps, Theme } from '@mui/material';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  loading?: boolean;
  secondary?: string;
  minHeight?: number;
  iconBg?: string;
  sx?: SxProps<Theme>;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary.main', 
  loading = false, 
  secondary = '',
  minHeight = 140,
  iconBg = 'rgba(0, 0, 0, 0.04)',
  sx = {}
}) => {
  const theme = useTheme();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <Card sx={{ 
        minHeight, 
        boxShadow: theme.shadows[3], 
        borderRadius: 2,
        ...sx 
      }}>
        <CardContent sx={{ 
          padding: theme.spacing(2.5),
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
            <Avatar
              sx={{
                bgcolor: iconBg,
                width: 42, 
                height: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color
              }}
            >
              {React.cloneElement(icon as React.ReactElement, { size: 22 })}
            </Avatar>
          </Box>
          
          <Box className="value-container" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1
          }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color="text.primary" 
              align="center"
              sx={{ 
                fontSize: { xs: '1.8rem', sm: '2.2rem' },
                lineHeight: 1.2
              }}
            >
              {value}
            </Typography>
          </Box>
          
          {secondary && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} align="center">
              {secondary}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MetricCard; 
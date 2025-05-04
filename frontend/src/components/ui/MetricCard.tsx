import { Card, Typography, Avatar, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
}

export default function MetricCard({ title, value, icon, iconBg = '#E6EBF1' }: Props) {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4 }}
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Typography variant="h3" color="text.secondary">{title}</Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h1">{value}</Typography>
        <Avatar 
          sx={{ bgcolor: iconBg, width: 48, height: 48 }}
          aria-label={`${title} icon`}
        >
          {icon}
        </Avatar>
      </Box>
    </Card>
  );
} 
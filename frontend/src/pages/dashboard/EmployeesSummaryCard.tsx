import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  Skeleton,
  Stack, 
  CardHeader,
  Tooltip,
  IconButton,
  Avatar,
  AvatarGroup,
  Button
} from '@mui/material';
import { 
  Group as GroupIcon,
  Info as InfoIcon,
  BeachAccess as VacationIcon,
  Work as WorkIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface EmployeesSummaryCardProps {
  isLoading: boolean;
  totalFuncionarios: number;
  funcionariosAtivos: number;
  funcionariosEmFerias: number;
}

const EmployeesSummaryCard: React.FC<EmployeesSummaryCardProps> = ({
  isLoading,
  totalFuncionarios,
  funcionariosAtivos,
  funcionariosEmFerias
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleNavigateToEmployees = () => {
    navigate('/dashboard/funcionarios');
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'info.main' 
      }}
      elevation={2}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <GroupIcon sx={{ mr: 1, color: 'info.main' }} />
            <Typography variant="h6" component="div">
              {t('funcionarios')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('funcionariosInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {isLoading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" height={60} />
            <Skeleton variant="rectangular" height={40} />
            <Skeleton variant="rectangular" height={40} />
          </Stack>
        ) : (
          <>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="bold" color="info.main">
                  {totalFuncionarios}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('totalFuncionarios')}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      bgcolor: 'success.main', 
                      mr: 1 
                    }}
                  >
                    <WorkIcon sx={{ fontSize: '0.9rem' }} />
                  </Avatar>
                  <Typography variant="body2">
                    {t('funcionariosAtivos')}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="bold">
                  {funcionariosAtivos}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      bgcolor: 'warning.main', 
                      mr: 1 
                    }}
                  >
                    <VacationIcon sx={{ fontSize: '0.9rem' }} />
                  </Avatar>
                  <Typography variant="body2">
                    {t('funcionariosFerias')}
                  </Typography>
                </Box>
                <Typography variant="body1" fontWeight="bold" color={funcionariosEmFerias > 0 ? 'warning.main' : undefined}>
                  {funcionariosEmFerias}
                </Typography>
              </Box>
              
              {/* Avatar group simulando funcionários */}
              {funcionariosEmFerias > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    {t('funcionariosEmFerias')}:
                  </Typography>
                  <AvatarGroup max={5} sx={{ justifyContent: 'center' }}>
                    <Avatar alt="Funcionário 1" src="/static/images/avatar/1.jpg" />
                    <Avatar alt="Funcionário 2" src="/static/images/avatar/2.jpg" />
                    <Avatar alt="Funcionário 3" src="/static/images/avatar/3.jpg" />
                  </AvatarGroup>
                </Box>
              )}
            </Stack>
          </>
        )}
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
        <Button 
          variant="text" 
          color="info" 
          fullWidth 
          onClick={handleNavigateToEmployees}
          endIcon={<ArrowIcon />}
          size="small"
        >
          {t('gerenciarFuncionarios')}
        </Button>
      </Box>
    </Card>
  );
};

export default EmployeesSummaryCard; 
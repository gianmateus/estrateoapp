/**
 * Página inicial da aplicação com apresentação do produto e planos disponíveis
 * Landing page of the application with product presentation and available plans
 */
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Stack,
  Link as MuiLink,
  AppBar,
  Toolbar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { 
  Settings as SettingsIcon,
  SmartToy as AIIcon,
  Chat as ChatIcon,
  BarChart as BarChartIcon,
  Check as CheckIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Interface para opções de preços/planos disponíveis
 * Interface for available price/plan options
 */
interface PriceOption {
  title: string;           // Título do plano | Plan title
  price: number;           // Preço do plano | Plan price
  features: string[];      // Lista de recursos do plano | List of plan features
  buttonText: string;      // Texto do botão de ação | Action button text
  buttonVariant: 'outlined' | 'contained'; // Variante do botão | Button variant
  highlighted?: boolean;   // Se o plano é destacado | Whether the plan is highlighted
}

/**
 * Componente principal da página inicial
 * Main component of the landing page
 */
const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Definição dos planos de preços
  // Definition of pricing plans
  const pricingPlans: PriceOption[] = [
    {
      title: 'Starter',
      price: 49,
      features: [
        'Core tools',
        '1 user',
        'Monthly AI insights',
        'WhatsApp reports'
      ],
      buttonText: 'Start Now',
      buttonVariant: 'outlined'
    },
    {
      title: 'Professional',
      price: 99,
      features: [
        'Everything in Starter',
        'Up to 3 users',
        'Weekly insights',
        'Full access to inventory and financial tools'
      ],
      buttonText: 'Upgrade',
      buttonVariant: 'contained',
      highlighted: true
    },
    {
      title: 'Enterprise',
      price: 199,
      features: [
        'All features unlocked',
        'Unlimited users',
        'Advanced AI analytics',
        'Priority support',
        'Accounting reports'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outlined'
    }
  ];

  return (
    <Box sx={{ bgcolor: '#fff', color: '#000', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar 
        position="sticky" 
        color="default" 
        elevation={0}
        sx={{ 
          bgcolor: '#fff', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 }, py: 1 }}>
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                mr: 2
              }}
            >
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  fontSize: '1.5rem'
                }}
              >
                ESTRATEO
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <MuiLink 
                component={Link} 
                to="/features" 
                underline="none" 
                color="#000"
                sx={{ fontWeight: 500 }}
              >
                Features
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/pricing" 
                underline="none" 
                color="#000"
                sx={{ fontWeight: 500 }}
              >
                Pricing
              </MuiLink>
              <MuiLink 
                component={Link} 
                to="/about" 
                underline="none" 
                color="#000"
                sx={{ fontWeight: 500 }}
              >
                About
              </MuiLink>
            </Stack>
            
            <Box sx={{ flexGrow: 0, ml: 4, display: 'flex', gap: 2 }}>
              <Button 
                variant="outlined" 
                sx={{ 
                  borderColor: '#000',
                  color: '#000',
                  borderRadius: '6px',
                  '&:hover': {
                    borderColor: '#333',
                    bgcolor: 'rgba(0,0,0,0.04)'
                  }
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#000',
                  color: '#fff',
                  borderRadius: '6px',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#333',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => navigate('/cadastro')}
              >
                Get Started
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 8, textAlign: 'center' }}>
        <Typography 
          variant="h1" 
          component="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', md: '4rem' }, 
            fontWeight: 700,
            mb: 2,
            letterSpacing: '-0.02em',
            color: '#000'
          }}
        >
          Supercharge your business
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            maxWidth: '650px', 
            mx: 'auto', 
            color: '#000',
            mb: 6,
            px: 2,
            lineHeight: 1.5
          }}
        >
          Streamline your strategy and achieve success with our powerful, easy-to-use platform.
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          sx={{ 
            bgcolor: '#000',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '1rem',
            py: 1.5,
            px: 4,
            '&:hover': {
              bgcolor: '#333'
            }
          }}
          onClick={() => navigate('/cadastro')}
        >
          Get Started
        </Button>
      </Container>

      {/* Product Mockup */}
      <Container maxWidth="lg" sx={{ textAlign: 'center', mb: 12 }}>
        <Box 
          component="img"
          src="https://raw.githubusercontent.com/gianmateus/estrateo/main/frontend/public/assets/device-mockup.png"
          alt="Estrateo product mockup"
          sx={{ 
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          }}
        />
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Grid container spacing={6}>
          {/* Customizable Tools */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ textAlign: 'center' }}>
              <SettingsIcon sx={{ fontSize: 48, mb: 2, color: '#000' }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom color="#000">
                Customizable Tools
              </Typography>
              <Typography variant="body2" color="#000">
                Adapt your strategy with our flexible, intuitive tools.
              </Typography>
            </Box>
          </Grid>
          
          {/* AI-Powered Insights */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ textAlign: 'center' }}>
              <AIIcon sx={{ fontSize: 48, mb: 2, color: '#000' }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom color="#000">
                AI-Powered Insights
              </Typography>
              <Typography variant="body2" color="#000">
                Leverage artificial intelligence to make smarter decisions.
              </Typography>
            </Box>
          </Grid>
          
          {/* Real-Time Communication */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ textAlign: 'center' }}>
              <ChatIcon sx={{ fontSize: 48, mb: 2, color: '#000' }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom color="#000">
                Real-Time Communication
              </Typography>
              <Typography variant="body2" color="#000">
                Engage with clients directly via WhatsApp integration.
              </Typography>
            </Box>
          </Grid>
          
          {/* Data-Driven Decisions */}
          <Grid item xs={12} md={6} lg={3}>
            <Box sx={{ textAlign: 'center' }}>
              <BarChartIcon sx={{ fontSize: 48, mb: 2, color: '#000' }} />
              <Typography variant="h6" fontWeight="bold" gutterBottom color="#000">
                Data-Driven Decisions
              </Typography>
              <Typography variant="body2" color="#000">
                Make informed choices with comprehensive analytics.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Testimonial / Authority Section */}
      <Box sx={{ bgcolor: '#f5f5f7', py: 10 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 3,
              letterSpacing: '-0.02em',
              color: '#000'
            }}
          >
            Built for real businesses. Trusted by professionals.
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#000',
              mb: 3,
              fontWeight: 400
            }}
          >
            Maximize your results and drive growth with our essential suite of tools, tested in the European market.
          </Typography>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          sx={{ 
            fontWeight: 700,
            mb: 6,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            color: '#000'
          }}
        >
          Choose your plan
        </Typography>
        
        <Grid container spacing={4} justifyContent="center">
          {pricingPlans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.title}>
              <Card 
                elevation={plan.highlighted ? 2 : 0}
                sx={{ 
                  height: '100%',
                  borderRadius: '12px',
                  border: plan.highlighted ? '2px solid #000' : '1px solid #e0e0e0',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  },
                  position: 'relative'
                }}
              >
                {plan.highlighted && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#f1f1f1',
                      color: '#111',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      py: 0.5,
                      px: 1.5,
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      zIndex: 1,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {t('plans.popular', 'Mais Popular')}
                  </Box>
                )}
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom color="#000">
                    {plan.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 3 }}>
                    <Typography variant="h3" component="span" fontWeight="bold" color="#000">
                      €{plan.price}
                    </Typography>
                    <Typography variant="subtitle1" component="span" sx={{ ml: 1, color: '#000' }}>
                      /month
                    </Typography>
                  </Box>
                  
                  <List sx={{ mb: 3 }}>
                    {plan.features.map((feature) => (
                      <ListItem key={feature} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckIcon sx={{ color: '#000' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={feature} 
                          primaryTypographyProps={{ 
                            variant: 'body2',
                            fontWeight: 500,
                            color: '#000'
                          }} 
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Button 
                    variant={plan.buttonVariant}
                    fullWidth
                    sx={{ 
                      py: 1.5,
                      borderRadius: '6px',
                      ...(plan.buttonVariant === 'contained' && {
                        bgcolor: '#000',
                        color: '#fff',
                        '&:hover': {
                          bgcolor: '#333'
                        }
                      }),
                      ...(plan.buttonVariant === 'outlined' && {
                        borderColor: '#000',
                        color: '#000',
                        '&:hover': {
                          borderColor: '#333',
                          bgcolor: 'rgba(0,0,0,0.04)'
                        }
                      })
                    }}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: '#f5f5f7', py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            sx={{ 
              fontWeight: 700,
              mb: 4,
              letterSpacing: '-0.02em',
              color: '#000'
            }}
          >
            Ready to get started?
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            sx={{ 
              bgcolor: '#000',
              color: '#fff',
              borderRadius: '6px',
              fontSize: '1rem',
              py: 1.5,
              px: 4,
              '&:hover': {
                bgcolor: '#333'
              }
            }}
            onClick={() => navigate('/cadastro')}
          >
            Get Started
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 6, textAlign: 'center', bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 3, sm: 6 }}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <MuiLink 
              component={Link} 
              to="/features" 
              underline="none" 
              color="#000"
              sx={{ fontWeight: 500 }}
            >
              Features
            </MuiLink>
            <MuiLink 
              component={Link} 
              to="/pricing" 
              underline="none" 
              color="#000"
              sx={{ fontWeight: 500 }}
            >
              Pricing
            </MuiLink>
            <MuiLink 
              component={Link} 
              to="/about" 
              underline="none" 
              color="#000"
              sx={{ fontWeight: 500 }}
            >
              About
            </MuiLink>
            <MuiLink 
              component={Link} 
              to="/privacy" 
              underline="none" 
              color="#000"
              sx={{ fontWeight: 500 }}
            >
              Privacy Policy
            </MuiLink>
          </Stack>
          
          <Divider sx={{ maxWidth: '400px', mx: 'auto', mb: 4 }} />
          
          <Stack 
            direction="row" 
            spacing={3}
            justifyContent="center"
          >
            <IconButton color="inherit" aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="LinkedIn">
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 
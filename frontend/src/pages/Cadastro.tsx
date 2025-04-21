import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Divider,
  Select,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Menu
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Business,
  Email,
  Payments as PaymentsIcon,
  Check as CheckIcon,
  SmartToy as AIIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
  WhatsApp as WhatsAppIcon,
  Support as SupportIcon,
  Palette as PaletteIcon,
  Phone as PhoneIcon,
  ErrorOutline,
  KeyboardArrowDown,
  Search as SearchIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { Global, css } from '@emotion/react';
import ReactCountryFlag from 'react-country-flag';

/**
 * Form data interface for user registration
 * Interface de dados do formulário para registro de usuário
 */
interface FormData {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  empresa: string;
  aceitaTermos: boolean;
  telefone: string;
  nomeRestaurante: string;
  cnpj: string;
  endereco: string;
  tipoNegocio: string;
  accountType: 'personal' | 'business';
}

/**
 * Form errors interface to track validation errors
 * Interface de erros do formulário para rastrear erros de validação
 */
interface FormErrors {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  empresa: string;
  aceitaTermos: string;
  telefone: string;
  nomeRestaurante: string;
  cnpj: string;
  endereco: string;
  tipoNegocio: string;
}

// Registration steps translated to English
// Etapas de registro traduzidas para inglês
const passos = ['Personal Information', 'Business Details', 'Confirmation'];

// Business types translated to English
// Tipos de negócio traduzidos para inglês
const tiposNegocio = [
  { value: 'restaurante', label: 'Traditional Restaurant' },
  { value: 'fast-food', label: 'Fast Food' },
  { value: 'pizzaria', label: 'Pizza Place' },
  { value: 'cafeteria', label: 'Café' },
  { value: 'buffet', label: 'Buffet/Self-Service' },
  { value: 'outro', label: 'Other' }
];

// Lista completa de países com bandeiras e códigos de DDI
const countries = [
  { code: 'de', name: 'Deutschland', dialCode: '+49' },
  { code: 'af', name: 'Afghanistan', dialCode: '+93' },
  { code: 'al', name: 'Albania', dialCode: '+355' },
  { code: 'dz', name: 'Algeria', dialCode: '+213' },
  { code: 'ad', name: 'Andorra', dialCode: '+376' },
  { code: 'ao', name: 'Angola', dialCode: '+244' },
  { code: 'ar', name: 'Argentina', dialCode: '+54' },
  { code: 'am', name: 'Armenia', dialCode: '+374' },
  { code: 'au', name: 'Australia', dialCode: '+61' },
  { code: 'at', name: 'Austria', dialCode: '+43' },
  { code: 'az', name: 'Azerbaijan', dialCode: '+994' },
  { code: 'bs', name: 'Bahamas', dialCode: '+1' },
  { code: 'bh', name: 'Bahrain', dialCode: '+973' },
  { code: 'bd', name: 'Bangladesh', dialCode: '+880' },
  { code: 'bb', name: 'Barbados', dialCode: '+1' },
  { code: 'by', name: 'Belarus', dialCode: '+375' },
  { code: 'be', name: 'Belgium', dialCode: '+32' },
  { code: 'bz', name: 'Belize', dialCode: '+501' },
  { code: 'bj', name: 'Benin', dialCode: '+229' },
  { code: 'bt', name: 'Bhutan', dialCode: '+975' },
  { code: 'bo', name: 'Bolivia', dialCode: '+591' },
  { code: 'ba', name: 'Bosnia', dialCode: '+387' },
  { code: 'bw', name: 'Botswana', dialCode: '+267' },
  { code: 'br', name: 'Brasil', dialCode: '+55' },
  { code: 'bn', name: 'Brunei', dialCode: '+673' },
  { code: 'bg', name: 'Bulgaria', dialCode: '+359' },
  { code: 'bf', name: 'Burkina Faso', dialCode: '+226' },
  { code: 'bi', name: 'Burundi', dialCode: '+257' },
  { code: 'kh', name: 'Cambodia', dialCode: '+855' },
  { code: 'cm', name: 'Cameroon', dialCode: '+237' },
  { code: 'ca', name: 'Canada', dialCode: '+1' },
  { code: 'cv', name: 'Cape Verde', dialCode: '+238' },
  { code: 'cf', name: 'Central African Republic', dialCode: '+236' },
  { code: 'td', name: 'Chad', dialCode: '+235' },
  { code: 'cl', name: 'Chile', dialCode: '+56' },
  { code: 'cn', name: 'China', dialCode: '+86' },
  { code: 'co', name: 'Colombia', dialCode: '+57' },
  { code: 'km', name: 'Comoros', dialCode: '+269' },
  { code: 'cg', name: 'Congo', dialCode: '+242' },
  { code: 'cd', name: 'Congo (DRC)', dialCode: '+243' },
  { code: 'cr', name: 'Costa Rica', dialCode: '+506' },
  { code: 'hr', name: 'Croatia', dialCode: '+385' },
  { code: 'cu', name: 'Cuba', dialCode: '+53' },
  { code: 'cy', name: 'Cyprus', dialCode: '+357' },
  { code: 'cz', name: 'Czech Republic', dialCode: '+420' },
  { code: 'dk', name: 'Denmark', dialCode: '+45' },
  { code: 'dj', name: 'Djibouti', dialCode: '+253' },
  { code: 'do', name: 'Dominican Republic', dialCode: '+1' },
  { code: 'ec', name: 'Ecuador', dialCode: '+593' },
  { code: 'eg', name: 'Egypt', dialCode: '+20' },
  { code: 'sv', name: 'El Salvador', dialCode: '+503' },
  { code: 'gq', name: 'Equatorial Guinea', dialCode: '+240' },
  { code: 'er', name: 'Eritrea', dialCode: '+291' },
  { code: 'ee', name: 'Estonia', dialCode: '+372' },
  { code: 'et', name: 'Ethiopia', dialCode: '+251' },
  { code: 'fj', name: 'Fiji', dialCode: '+679' },
  { code: 'fi', name: 'Finland', dialCode: '+358' },
  { code: 'fr', name: 'France', dialCode: '+33' },
  { code: 'ga', name: 'Gabon', dialCode: '+241' },
  { code: 'gm', name: 'Gambia', dialCode: '+220' },
  { code: 'ge', name: 'Georgia', dialCode: '+995' },
  { code: 'gh', name: 'Ghana', dialCode: '+233' },
  { code: 'gr', name: 'Greece', dialCode: '+30' },
  { code: 'gl', name: 'Greenland', dialCode: '+299' },
  { code: 'gt', name: 'Guatemala', dialCode: '+502' },
  { code: 'gn', name: 'Guinea', dialCode: '+224' },
  { code: 'gw', name: 'Guinea-Bissau', dialCode: '+245' },
  { code: 'gy', name: 'Guyana', dialCode: '+592' },
  { code: 'ht', name: 'Haiti', dialCode: '+509' },
  { code: 'hn', name: 'Honduras', dialCode: '+504' },
  { code: 'hk', name: 'Hong Kong', dialCode: '+852' },
  { code: 'hu', name: 'Hungary', dialCode: '+36' },
  { code: 'is', name: 'Iceland', dialCode: '+354' },
  { code: 'in', name: 'India', dialCode: '+91' },
  { code: 'id', name: 'Indonesia', dialCode: '+62' },
  { code: 'ir', name: 'Iran', dialCode: '+98' },
  { code: 'iq', name: 'Iraq', dialCode: '+964' },
  { code: 'ie', name: 'Ireland', dialCode: '+353' },
  { code: 'il', name: 'Israel', dialCode: '+972' },
  { code: 'it', name: 'Italy', dialCode: '+39' },
  { code: 'ci', name: 'Ivory Coast', dialCode: '+225' },
  { code: 'jm', name: 'Jamaica', dialCode: '+1' },
  { code: 'jp', name: 'Japan', dialCode: '+81' },
  { code: 'jo', name: 'Jordan', dialCode: '+962' },
  { code: 'kz', name: 'Kazakhstan', dialCode: '+7' },
  { code: 'ke', name: 'Kenya', dialCode: '+254' },
  { code: 'ki', name: 'Kiribati', dialCode: '+686' },
  { code: 'kw', name: 'Kuwait', dialCode: '+965' },
  { code: 'kg', name: 'Kyrgyzstan', dialCode: '+996' },
  { code: 'la', name: 'Laos', dialCode: '+856' },
  { code: 'lv', name: 'Latvia', dialCode: '+371' },
  { code: 'lb', name: 'Lebanon', dialCode: '+961' },
  { code: 'ls', name: 'Lesotho', dialCode: '+266' },
  { code: 'lr', name: 'Liberia', dialCode: '+231' },
  { code: 'ly', name: 'Libya', dialCode: '+218' },
  { code: 'li', name: 'Liechtenstein', dialCode: '+423' },
  { code: 'lt', name: 'Lithuania', dialCode: '+370' },
  { code: 'lu', name: 'Luxembourg', dialCode: '+352' },
  { code: 'mg', name: 'Madagascar', dialCode: '+261' },
  { code: 'mw', name: 'Malawi', dialCode: '+265' },
  { code: 'my', name: 'Malaysia', dialCode: '+60' },
  { code: 'mv', name: 'Maldives', dialCode: '+960' },
  { code: 'ml', name: 'Mali', dialCode: '+223' },
  { code: 'mt', name: 'Malta', dialCode: '+356' },
  { code: 'mh', name: 'Marshall Islands', dialCode: '+692' },
  { code: 'mr', name: 'Mauritania', dialCode: '+222' },
  { code: 'mu', name: 'Mauritius', dialCode: '+230' },
  { code: 'mx', name: 'Mexico', dialCode: '+52' },
  { code: 'fm', name: 'Micronesia', dialCode: '+691' },
  { code: 'md', name: 'Moldova', dialCode: '+373' },
  { code: 'mc', name: 'Monaco', dialCode: '+377' },
  { code: 'mn', name: 'Mongolia', dialCode: '+976' },
  { code: 'me', name: 'Montenegro', dialCode: '+382' },
  { code: 'ma', name: 'Morocco', dialCode: '+212' },
  { code: 'mz', name: 'Mozambique', dialCode: '+258' },
  { code: 'mm', name: 'Myanmar', dialCode: '+95' },
  { code: 'na', name: 'Namibia', dialCode: '+264' },
  { code: 'nr', name: 'Nauru', dialCode: '+674' },
  { code: 'np', name: 'Nepal', dialCode: '+977' },
  { code: 'nl', name: 'Netherlands', dialCode: '+31' },
  { code: 'nz', name: 'New Zealand', dialCode: '+64' },
  { code: 'ni', name: 'Nicaragua', dialCode: '+505' },
  { code: 'ne', name: 'Niger', dialCode: '+227' },
  { code: 'ng', name: 'Nigeria', dialCode: '+234' },
  { code: 'kp', name: 'North Korea', dialCode: '+850' },
  { code: 'mk', name: 'North Macedonia', dialCode: '+389' },
  { code: 'no', name: 'Norway', dialCode: '+47' },
  { code: 'om', name: 'Oman', dialCode: '+968' },
  { code: 'pk', name: 'Pakistan', dialCode: '+92' },
  { code: 'pw', name: 'Palau', dialCode: '+680' },
  { code: 'ps', name: 'Palestine', dialCode: '+970' },
  { code: 'pa', name: 'Panama', dialCode: '+507' },
  { code: 'pg', name: 'Papua New Guinea', dialCode: '+675' },
  { code: 'py', name: 'Paraguay', dialCode: '+595' },
  { code: 'pe', name: 'Peru', dialCode: '+51' },
  { code: 'ph', name: 'Philippines', dialCode: '+63' },
  { code: 'pl', name: 'Poland', dialCode: '+48' },
  { code: 'pt', name: 'Portugal', dialCode: '+351' },
  { code: 'qa', name: 'Qatar', dialCode: '+974' },
  { code: 'ro', name: 'Romania', dialCode: '+40' },
  { code: 'ru', name: 'Russia', dialCode: '+7' },
  { code: 'rw', name: 'Rwanda', dialCode: '+250' },
  { code: 'kn', name: 'Saint Kitts and Nevis', dialCode: '+1' },
  { code: 'lc', name: 'Saint Lucia', dialCode: '+1' },
  { code: 'vc', name: 'Saint Vincent', dialCode: '+1' },
  { code: 'ws', name: 'Samoa', dialCode: '+685' },
  { code: 'sm', name: 'San Marino', dialCode: '+378' },
  { code: 'st', name: 'São Tomé and Príncipe', dialCode: '+239' },
  { code: 'sa', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'sn', name: 'Senegal', dialCode: '+221' },
  { code: 'rs', name: 'Serbia', dialCode: '+381' },
  { code: 'sc', name: 'Seychelles', dialCode: '+248' },
  { code: 'sl', name: 'Sierra Leone', dialCode: '+232' },
  { code: 'sg', name: 'Singapore', dialCode: '+65' },
  { code: 'sk', name: 'Slovakia', dialCode: '+421' },
  { code: 'si', name: 'Slovenia', dialCode: '+386' },
  { code: 'sb', name: 'Solomon Islands', dialCode: '+677' },
  { code: 'so', name: 'Somalia', dialCode: '+252' },
  { code: 'za', name: 'South Africa', dialCode: '+27' },
  { code: 'kr', name: 'South Korea', dialCode: '+82' },
  { code: 'ss', name: 'South Sudan', dialCode: '+211' },
  { code: 'es', name: 'Spain', dialCode: '+34' },
  { code: 'lk', name: 'Sri Lanka', dialCode: '+94' },
  { code: 'sd', name: 'Sudan', dialCode: '+249' },
  { code: 'sr', name: 'Suriname', dialCode: '+597' },
  { code: 'sz', name: 'Swaziland', dialCode: '+268' },
  { code: 'se', name: 'Sweden', dialCode: '+46' },
  { code: 'ch', name: 'Switzerland', dialCode: '+41' },
  { code: 'sy', name: 'Syria', dialCode: '+963' },
  { code: 'tw', name: 'Taiwan', dialCode: '+886' },
  { code: 'tj', name: 'Tajikistan', dialCode: '+992' },
  { code: 'tz', name: 'Tanzania', dialCode: '+255' },
  { code: 'th', name: 'Thailand', dialCode: '+66' },
  { code: 'tl', name: 'Timor-Leste', dialCode: '+670' },
  { code: 'tg', name: 'Togo', dialCode: '+228' },
  { code: 'to', name: 'Tonga', dialCode: '+676' },
  { code: 'tt', name: 'Trinidad and Tobago', dialCode: '+1' },
  { code: 'tn', name: 'Tunisia', dialCode: '+216' },
  { code: 'tr', name: 'Turkey', dialCode: '+90' },
  { code: 'tm', name: 'Turkmenistan', dialCode: '+993' },
  { code: 'tv', name: 'Tuvalu', dialCode: '+688' },
  { code: 'ug', name: 'Uganda', dialCode: '+256' },
  { code: 'ua', name: 'Ukraine', dialCode: '+380' },
  { code: 'ae', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'gb', name: 'United Kingdom', dialCode: '+44' },
  { code: 'us', name: 'United States', dialCode: '+1' },
  { code: 'uy', name: 'Uruguay', dialCode: '+598' },
  { code: 'uz', name: 'Uzbekistan', dialCode: '+998' },
  { code: 'vu', name: 'Vanuatu', dialCode: '+678' },
  { code: 'va', name: 'Vatican City', dialCode: '+39' },
  { code: 've', name: 'Venezuela', dialCode: '+58' },
  { code: 'vn', name: 'Vietnam', dialCode: '+84' },
  { code: 'ye', name: 'Yemen', dialCode: '+967' },
  { code: 'zm', name: 'Zambia', dialCode: '+260' },
  { code: 'zw', name: 'Zimbabwe', dialCode: '+263' },
];

/**
 * Registration component for new users
 * Componente de cadastro para novos usuários
 */
const Cadastro = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Alemanha como padrão
  const [countryMenuAnchor, setCountryMenuAnchor] = useState<null | HTMLElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    empresa: '',
    aceitaTermos: false,
    telefone: '',
    nomeRestaurante: '',
    cnpj: '',
    endereco: '',
    tipoNegocio: '',
    accountType: 'personal',
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    empresa: '',
    aceitaTermos: '',
    telefone: '',
    nomeRestaurante: '',
    cnpj: '',
    endereco: '',
    tipoNegocio: '',
  });

  /**
   * Handles input changes for text fields
   * Gerencia mudanças de entrada para campos de texto
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when editing
    // Limpar erro ao editar
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Handles changes for the phone input
   * Gerencia mudanças para o campo de telefone
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Permite apenas dígitos, espaços, parênteses, traços e símbolos de adição
    const sanitizedInput = input.replace(/[^\d\s()+\-]/g, '');
    
    setFormData(prev => ({
      ...prev,
      telefone: sanitizedInput,
    }));
    
    if (formErrors.telefone) {
      setFormErrors(prev => ({
        ...prev,
        telefone: '',
      }));
    }
  };

  /**
   * Handles changes for select inputs
   * Gerencia mudanças para inputs de seleção
   */
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Toggles password visibility
   * Alterna a visibilidade da senha
   */
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Handles opening the country selection menu
   * Gerencia a abertura do menu de seleção de país
   */
  const handleCountryMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setCountryMenuAnchor(event.currentTarget);
    setSearchTerm('');
  };

  /**
   * Handles closing the country selection menu
   * Gerencia o fechamento do menu de seleção de país
   */
  const handleCountryMenuClose = () => {
    setCountryMenuAnchor(null);
  };

  /**
   * Handles selecting a country from the menu
   * Gerencia a seleção de um país do menu
   */
  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country);
    handleCountryMenuClose();
  };

  /**
   * Handles search term changes for country filtering
   */
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /**
   * Filters countries based on search term
   */
  const filteredCountries = searchTerm 
    ? countries.filter(country => 
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        country.dialCode.includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : countries;

  /**
   * Validates the form data and returns any errors
   * Valida os dados do formulário e retorna quaisquer erros
   */
  const validateForm = () => {
    const errors: FormErrors = {
      nome: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      empresa: '',
      aceitaTermos: '',
      telefone: '',
      nomeRestaurante: '',
      cnpj: '',
      endereco: '',
      tipoNegocio: '',
    };

    // Validate name
    if (!formData.nome.trim()) {
      errors.nome = 'Name is required';
    } else if (formData.nome.trim().length < 3) {
      errors.nome = 'Name must be at least 3 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone number
    if (!formData.telefone.trim()) {
      errors.telefone = 'Phone number is required';
    } else if (formData.telefone.replace(/[^\d]/g, '').length < 8) {
      errors.telefone = 'Phone number must have at least 8 digits';
    }

    // Validate company name
    if (formData.accountType === 'business' && !formData.empresa.trim()) {
      errors.empresa = 'Company name is required';
    }

    // Validate password
    if (!formData.senha) {
      errors.senha = 'Password is required';
    } else if (formData.senha.length < 6) {
      errors.senha = 'Password must be at least 6 characters';
    }

    // Validate password confirmation
    if (!formData.confirmarSenha) {
      errors.confirmarSenha = 'Please confirm your password';
    } else if (formData.senha !== formData.confirmarSenha) {
      errors.confirmarSenha = 'Passwords do not match';
    }

    // Validate terms acceptance
    if (!formData.aceitaTermos) {
      errors.aceitaTermos = 'You must accept the terms and conditions';
    }

    return errors;
  };

  /**
   * Validates the current form step before proceeding
   * Valida a etapa atual do formulário antes de prosseguir
   */
  const validateStep = () => {
    const newErrors = { ...formErrors };
    let isValid = true;

    if (activeStep === 0) {
      // Personal information validation
      // Validação de informações pessoais
      if (!formData.nome.trim()) {
        newErrors.nome = 'Full name is required';
        isValid = false;
      } else if (formData.nome.trim().length < 3) {
        newErrors.nome = 'Name must have at least 3 characters';
        isValid = false;
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email address';
        isValid = false;
      }
      
      if (!formData.senha) {
        newErrors.senha = 'Password is required';
        isValid = false;
      } else if (formData.senha.length < 6) {
        newErrors.senha = 'Password must be at least 6 characters long';
        isValid = false;
      }
      
      if (!formData.confirmarSenha) {
        newErrors.confirmarSenha = 'Please confirm your password';
        isValid = false;
      } else if (formData.senha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = 'Passwords do not match';
        isValid = false;
      }
      
      if (!formData.telefone.trim()) {
        newErrors.telefone = 'Phone number is required';
        isValid = false;
      } else if (formData.telefone.replace(/[^0-9]/g, '').length < 6 || 
                 formData.telefone.replace(/[^0-9]/g, '').length > 15) {
        newErrors.telefone = 'Phone number must be between 6 and 15 digits';
        isValid = false;
      }
    } else if (activeStep === 1) {
      // Business information validation
      // Validação de informações do negócio
      if (!formData.nomeRestaurante.trim()) {
        newErrors.nomeRestaurante = 'Business name is required';
        isValid = false;
      }
      
      if (!formData.cnpj.trim()) {
        newErrors.cnpj = 'Business ID is required';
        isValid = false;
      }
      
      if (!formData.endereco.trim()) {
        newErrors.endereco = 'Address is required';
        isValid = false;
      }
      
      if (!formData.tipoNegocio.trim()) {
        newErrors.tipoNegocio = 'Business type is required';
        isValid = false;
      }
    } else if (activeStep === 2) {
      // Terms validation
      // Validação dos termos
      if (!termsAccepted) {
        newErrors.aceitaTermos = 'You must accept the terms to continue';
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  /**
   * Advances to the next step if validation passes
   * Avança para a próxima etapa se a validação passar
   */
  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === passos.length - 1) {
        handleSubmit();
      } else {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  /**
   * Goes back to the previous step
   * Volta para a etapa anterior
   */
  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(0, prevStep - 1));
  };

  /**
   * Submits the form data
   * Envia os dados do formulário
   */
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Simulate network delay
      // Simular atraso de rede
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would add the actual registration logic
      // using fetch or axios to send data to the backend
      
      console.log('Registration data:', formData);
      
      // Redirect to login page after successful registration
      // Redirecionar para a página de login após cadastro bem-sucedido
      navigate('/login', { state: { message: 'Account created successfully! Please log in to continue.' } });
    } catch (err) {
      setError('Registration error. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders the appropriate step content
   * Renderiza o conteúdo apropriado da etapa
   */
  const renderizarPasso = (): React.ReactNode => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={!!formErrors.nome}
                helperText={typeof formErrors.nome === 'string' ? formErrors.nome : ''}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={typeof formErrors.email === 'string' ? formErrors.email : ''}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                value={formData.senha}
                onChange={handleChange}
                error={!!formErrors.senha}
                helperText={typeof formErrors.senha === 'string' ? formErrors.senha : ''}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmarSenha"
                type="password"
                value={formData.confirmarSenha}
                onChange={handleChange}
                error={!!formErrors.confirmarSenha}
                helperText={typeof formErrors.confirmarSenha === 'string' ? formErrors.confirmarSenha : ''}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" error={!!formErrors.telefone}>
                <InputLabel htmlFor="phone-input" sx={{
                  '&.Mui-focused': {
                    color: '#000000',
                  }
                }}>Phone Number</InputLabel>
                <OutlinedInput
                  id="phone-input"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  placeholder="123 456 7890"
                  startAdornment={
                    <InputAdornment position="start">
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          cursor: 'pointer',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s',
                          padding: '4px 8px',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                        onClick={handleCountryMenuOpen}
                      >
                        <Box component="span" sx={{ display: 'inline-block' }}>
                          <ReactCountryFlag
                            countryCode={selectedCountry.code.toUpperCase()}
                            svg
                            style={{
                              width: '24px',
                              height: '16px',
                              objectFit: 'cover',
                              marginRight: '8px',
                              borderRadius: '2px',
                              border: '1px solid rgba(0, 0, 0, 0.1)'
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ 
                          fontWeight: 500, 
                          marginRight: '4px',
                          color: 'rgba(0, 0, 0, 0.87)'
                        }}>
                          {typeof selectedCountry.dialCode === 'string' ? selectedCountry.dialCode : ''}
                        </Typography>
                        <KeyboardArrowDown fontSize="small" sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                      </Box>
                    </InputAdornment>
                  }
                  inputProps={{
                    maxLength: 20,
                  }}
                  sx={{
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000'
                    }
                  }}
                  label="Phone Number"
                />
                {formErrors.telefone && (
                  <FormHelperText>
                    {typeof formErrors.telefone === 'string' ? formErrors.telefone : ''}
                  </FormHelperText>
                )}
              </FormControl>
              <Menu
                anchorEl={countryMenuAnchor}
                open={Boolean(countryMenuAnchor)}
                onClose={handleCountryMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    maxHeight: 360,
                    width: 320,
                    borderRadius: '12px',
                    mt: 1,
                    overflow: 'hidden',
                    '& .MuiList-root': {
                      padding: 0
                    }
                  }
                }}
              >
                <Box sx={{ position: 'sticky', top: 0, zIndex: 1, bgcolor: 'white', p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
                  <TextField
                    fullWidth
                    placeholder="Search country..."
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Box component="span" sx={{ display: 'inline-flex' }}>
                            <SearchIcon fontSize="small" sx={{ color: 'rgba(0, 0, 0, 0.54)' }} />
                          </Box>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.15)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(0, 0, 0, 0.3)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000'
                        }
                      }
                    }}
                    size="small"
                  />
                </Box>
                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <MenuItem 
                        key={country.code} 
                        onClick={() => handleCountrySelect(country)}
                        selected={country.code === selectedCountry.code}
                        sx={{
                          padding: '10px 16px',
                          borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.12)'
                            }
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <Box component="span" sx={{ display: 'inline-block' }}>
                            <ReactCountryFlag
                              countryCode={country.code.toUpperCase()}
                              svg
                              style={{
                                width: '28px',
                                height: '20px',
                                marginRight: '12px',
                                objectFit: 'cover',
                                borderRadius: '2px',
                                border: '1px solid rgba(0, 0, 0, 0.1)'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ flex: 1 }}>
                            {typeof country.name === 'string' ? country.name : ''}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(0, 0, 0, 0.6)', fontWeight: 500, flexShrink: 0 }}>
                            {typeof country.dialCode === 'string' ? country.dialCode : ''}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No countries found
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Menu>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Name"
                name="nomeRestaurante"
                value={formData.nomeRestaurante}
                onChange={handleChange}
                error={!!formErrors.nomeRestaurante}
                helperText={typeof formErrors.nomeRestaurante === 'string' ? formErrors.nomeRestaurante : ''}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0e2149',
                      boxShadow: '0 0 0 2px rgba(14, 33, 73, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0e2149'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0e2149'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business ID"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleChange}
                error={!!formErrors.cnpj}
                helperText={typeof formErrors.cnpj === 'string' ? formErrors.cnpj : ''}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0e2149',
                      boxShadow: '0 0 0 2px rgba(14, 33, 73, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0e2149'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0e2149'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Address"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                error={!!formErrors.endereco}
                helperText={typeof formErrors.endereco === 'string' ? formErrors.endereco : ''}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0e2149',
                      boxShadow: '0 0 0 2px rgba(14, 33, 73, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#0e2149'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0e2149'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Business Type"
                name="tipoNegocio"
                value={formData.tipoNegocio}
                onChange={handleChange}
                error={!!formErrors.tipoNegocio}
                helperText={typeof formErrors.tipoNegocio === 'string' ? formErrors.tipoNegocio : ''}
                variant="outlined"
                placeholder="Ex: Bakery, Hair Salon, Online Store"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                      boxShadow: '0 0 0 2px rgba(0, 0, 0, 0.1)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#000000'
                  }
                }}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6">Review your information</Typography>
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>Personal Information:</Typography>
              <Typography>Name: {typeof formData.nome === 'string' ? formData.nome : ''}</Typography>
              <Typography>Email: {typeof formData.email === 'string' ? formData.email : ''}</Typography>
              <Typography>Phone: {typeof formData.telefone === 'string' ? formData.telefone : ''}</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>Business Information:</Typography>
              <Typography>Business Name: {typeof formData.nomeRestaurante === 'string' ? formData.nomeRestaurante : ''}</Typography>
              <Typography>Business ID: {typeof formData.cnpj === 'string' ? formData.cnpj : ''}</Typography>
              <Typography>Address: {typeof formData.endereco === 'string' ? formData.endereco : ''}</Typography>
              <Typography>Type: {typeof formData.tipoNegocio === 'string' ? formData.tipoNegocio : ''}</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                }
                label={<Box component="span">I have read and accept the terms of use and privacy policy</Box>}
              />
              {formErrors.aceitaTermos && (
                <Typography color="error" variant="body2">
                  {typeof formErrors.aceitaTermos === 'string' ? formErrors.aceitaTermos : ''}
                </Typography>
              )}
            </Grid>
          </Grid>
        );
      default:
        return "Unknown step";
    }
  };

  if (activeStep === passos.length - 1 && loading) {
    return (
      <Box 
        sx={{ 
          bgcolor: '#fff', 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Card
              elevation={0}
              sx={{
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #eaeaea',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'success.main',
                  color: 'white',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography component="h1" variant="h5" fontWeight="bold">
                  Registration Complete!
                </Typography>
              </Box>

              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>
                  Your account has been created successfully!
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Redirecting to the login page...
                </Typography>
                <CircularProgress size={24} />
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        bgcolor: '#fff', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Card
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #eaeaea',
              mb: 6
            }}
          >
            <Box
              sx={{
                p: 4,
                pb: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Company logo */}
              <Typography 
                variant="h6" 
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  fontSize: '1.5rem',
                  color: '#000000', 
                  mb: 1
                }}
              >
                ESTRATEO
              </Typography>
              
              {/* Main heading */}
              <Typography 
                component="h1" 
                variant="h4" 
                fontWeight="700"
                sx={{
                  letterSpacing: '-0.02em',
                  color: '#000000',
                  mb: 1
                }}
              >
                Create your account
              </Typography>
              
              {/* Subtitle */}
              <Typography 
                variant="body1" 
                color="text.secondary" 
                align="center"
                sx={{ mb: 4 }}
              >
                Fill in the details below to start managing your business
              </Typography>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    width: '100%', 
                    mb: 3,
                    borderRadius: '8px'
                  }}
                >
                  {typeof error === 'string' ? error : ''}
                </Alert>
              )}
              
              <Stepper 
                activeStep={activeStep} 
                sx={{ 
                  width: '100%', 
                  mb: 4,
                  '& .MuiStepLabel-root': {
                    color: 'text.secondary'
                  },
                  '& .MuiStepIcon-root.Mui-active': {
                    color: '#000000'
                  },
                  '& .MuiStepIcon-root.Mui-completed': {
                    color: '#000000'
                  }
                }}
              >
                {passos.map((label) => (
                  <Step key={label}>
                    <StepLabel>{typeof label === 'string' ? label : ''}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box sx={{ width: '100%', mt: 2 }}>
                {renderizarPasso()}
                
                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ mt: 4 }}
                  justifyContent="space-between"
                >
                  <Button
                    disabled={activeStep === 0 || loading}
                    onClick={handleBack}
                    variant="outlined"
                    sx={{ 
                      py: 1.5,
                      px: 3,
                      borderRadius: '6px',
                      borderColor: '#000000',
                      color: '#000000',
                      '&:hover': {
                        borderColor: '#000000',
                        bgcolor: 'rgba(0, 0, 0, 0.04)'
                      },
                      '&.Mui-disabled': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)'
                      }
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      px: 3,
                      borderRadius: '6px',
                      bgcolor: '#000000',
                      color: '#fff',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#333333',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    {activeStep === passos.length - 1 
                      ? (loading 
                          ? <Box component="span" sx={{ display: 'inline-flex' }}><CircularProgress size={24} color="inherit" /></Box>
                          : 'Complete Registration'
                        )
                      : 'Next'
                    }
                  </Button>
                </Stack>
              </Box>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link to="/login" style={{ 
                    textDecoration: 'none',
                    color: '#000000',
                    fontWeight: 500
                  }}>
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Cadastro; 
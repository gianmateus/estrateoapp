/**
 * Main application component that sets up the core structure of the Estrateo application
 * Handles theme configuration, routing, and global context providers
 * 
 * Componente principal da aplicação que configura a estrutura central da aplicação Estrateo
 * Gerencia configuração de tema, rotas e provedores de contexto globais
 */
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Financeiro from './pages/Financeiro';
import Inventario from './pages/Inventario';
import Pagamentos from './pages/Pagamentos';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Perfil from './pages/Perfil';
import AcessoNegado from './pages/AcessoNegado';
import InteligenciaArtificial from './pages/InteligenciaArtificial';
import Dashboard from './pages/Dashboard';
import Whatsapp from './pages/Whatsapp';
import TodoPage from './pages/TodoPage';
import ProtectedRoute from './components/ProtectedRoute';
import { DataProvider } from './contexts/DataProvider';
import { useTranslation } from 'react-i18next';
import { LanguageProvider, translations } from './contexts/IdiomaContext';
import { 
  VIEW_DASHBOARD_PERMISSION, 
  VIEW_PAYMENTS_PERMISSION,
  VIEW_INVENTORY_PERMISSION,
  VIEW_PROFILE_PERMISSION,
  VIEW_EMPLOYEES_PERMISSION
} from './constants/permissions';
import { AuthProvider } from './contexts/AuthContext';
import Calendario from './pages/Calendario';
import Funcionarios from './pages/Funcionarios';
import TimeVacationsPage from './pages/employees/time-vacations/TimeVacationsPage';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import Loading from './components/Loading';
import Contador from './pages/Contador';
import PermissionGuard from './components/PermissionGuard';
import { ThemeProvider } from './contexts/ThemeContext';

/**
 * Main application component that configures routes and providers
 * Creates the application structure and defines routing logic
 * 
 * Componente principal da aplicação que configura rotas e provedores
 * Cria a estrutura da aplicação e define a lógica de roteamento
 */
function App() {
  // Using the useTranslation hook to manage language
  // Usar o hook useTranslation para gerenciar o idioma
  const { i18n } = useTranslation();

  /**
   * Function to change the application language
   * Uses i18n to switch between supported languages
   * 
   * Função para mudar o idioma da aplicação
   * Usa i18n para alternar entre idiomas suportados
   */
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Language provider value using i18n
  const languageValue = React.useMemo(() => {
    // Verificar se o idioma atual está entre os suportados
    const currentLang = i18n.language;
    
    return {
      language: currentLang,
      setLanguage: changeLanguage,
      translations
    };
  }, [i18n.language, changeLanguage]);

  return (
    <ThemeProvider>
      <Router>
        <LanguageProvider value={languageValue}>
          <AuthProvider>
            <DataProvider>
              <Suspense fallback={<Loading />}>
                <Routes>
                  {/* Public routes accessible without authentication
                      Rotas públicas acessíveis sem autenticação */}
                  <Route path="/" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/acesso-negado" element={<AcessoNegado />} />
                  
                  {/* Nova rota para o componente Todo */}
                  <Route path="/todo" element={<TodoPage />} />

                  {/* Protected routes with Dashboard layout - require specific permissions
                      Rotas protegidas com layout do Dashboard - requerem permissões específicas */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route 
                      path="/dashboard/financeiro" 
                      element={
                        <PermissionGuard permission="financeiro.visualizar">
                          <Financeiro />
                        </PermissionGuard>
                      } 
                    />
                    <Route 
                      path="/dashboard/inventario" 
                      element={
                        <PermissionGuard permission="inventario.visualizar">
                          <Inventario />
                        </PermissionGuard>
                      } 
                    />
                    <Route 
                      path="/dashboard/pagamentos" 
                      element={
                        <PermissionGuard permission="pagamentos.visualizar">
                          <Pagamentos />
                        </PermissionGuard>
                      } 
                    />
                    <Route 
                      path="/dashboard/calendario" 
                      element={
                        <PermissionGuard permission="calendario.visualizar">
                          <Calendario />
                        </PermissionGuard>
                      } 
                    />
                    <Route 
                      path="/dashboard/funcionarios" 
                      element={
                        <PermissionGuard permission="funcionarios.visualizar">
                          <Funcionarios />
                        </PermissionGuard>
                      } 
                    />
                    <Route 
                      path="/dashboard/funcionarios/time-vacations" 
                      element={
                        <PermissionGuard permission="funcionarios.visualizar">
                          <TimeVacationsPage />
                        </PermissionGuard>
                      } 
                    />
                    <Route 
                      path="/dashboard/contador" 
                      element={
                        <PermissionGuard permission="financeiro.visualizar">
                          <Contador />
                        </PermissionGuard>
                      } 
                    />
                    <Route 
                      path="/dashboard/inteligencia-artificial" 
                      element={
                        <PermissionGuard permission="ia.visualizar">
                          <InteligenciaArtificial />
                        </PermissionGuard>
                      } 
                    />
                    <Route path="/dashboard/whatsapp" element={<Whatsapp />} />
                    <Route path="/dashboard/perfil" element={<Perfil />} />
                    <Route path="/dashboard/todo" element={<TodoPage />} />
                  </Route>
                  {/* Redirects for routes not found
                       Redirecionamentos para rotas não encontradas */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </DataProvider>
          </AuthProvider>
        </LanguageProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
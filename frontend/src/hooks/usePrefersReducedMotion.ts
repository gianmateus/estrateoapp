/**
 * Hook para detectar preferência de redução de movimento
 * 
 * Detecta se o usuário prefere reduzir o movimento na interface,
 * permitindo desativar ou simplificar animações para melhorar a acessibilidade.
 */

import { useState, useEffect } from 'react';

/**
 * Hook personalizado que detecta a preferência do usuário para redução de movimento
 * @returns {boolean} Verdadeiro se o usuário prefere reduzir o movimento
 */
const usePrefersReducedMotion = (): boolean => {
  // Estado inicial baseado na media query
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    // Verificar se estamos no ambiente do navegador
    if (typeof window === 'undefined') return false;
    
    // Verificar preferência através da media query
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    // Verificar se estamos no ambiente do navegador
    if (typeof window === 'undefined') return;
    
    // Media query para detectar preferência de redução de movimento
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Função para atualizar o estado quando a preferência mudar
    const handleChange = (event: MediaQueryListEvent): void => {
      setPrefersReducedMotion(event.matches);
    };

    // Adicionar listener para mudanças na preferência
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleChange);
    }

    // Cleanup: remover listener quando o componente for desmontado
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback para navegadores mais antigos
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
};

export default usePrefersReducedMotion; 
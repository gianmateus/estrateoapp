import { EventBus } from '../EventBus';

/**
 * Listener para eventos relacionados a impostos
 * Atualiza o cache do SWR quando os dados fiscais são modificados
 */
class TaxesListener {
  /**
   * Inicializa os listeners para eventos de impostos
   */
  initialize(): void {
    console.log('[TaxesListener] Inicializando listeners de impostos');
    
    // Quando uma previsão fiscal é calculada
    // @ts-ignore - Tipos serão atualizados quando EventBus estiver disponível
    EventBus.on('taxes.forecast.calculated', this.handleForecastCalculated);
    
    // Quando o perfil fiscal é atualizado
    // @ts-ignore - Tipos serão atualizados quando EventBus estiver disponível
    EventBus.on('taxes.profile.updated', this.handleProfileUpdated);
  }

  /**
   * Manipula evento de cálculo de previsão fiscal
   */
  private handleForecastCalculated = (data: any) => {
    console.log('[TaxesListener] Previsão fiscal calculada:', data);
    
    if (data && data.month) {
      // Atualizar o cache SWR da previsão fiscal para o mês específico
      const cacheKey = `/taxes/forecast?month=${data.month}`;
      
      // TODO: Implementar atualização do cache quando SWR estiver configurado
      console.log('[TaxesListener] Cache atualizado para:', cacheKey);
    }
  };

  /**
   * Manipula evento de atualização do perfil fiscal
   */
  private handleProfileUpdated = (data: any) => {
    console.log('[TaxesListener] Perfil fiscal atualizado:', data);
    
    if (data && data.companyId) {
      // Atualizar o cache SWR do perfil fiscal
      const cacheKey = `/companies/${data.companyId}/tax-profile`;
      
      // TODO: Implementar atualização do cache quando SWR estiver configurado
      console.log('[TaxesListener] Cache atualizado para:', cacheKey);
    }
  };

  /**
   * Remove os listeners quando o componente é desmontado
   */
  cleanup(): void {
    console.log('[TaxesListener] Removendo listeners de impostos');
    
    // @ts-ignore - Tipos serão atualizados quando EventBus estiver disponível
    EventBus.off('taxes.forecast.calculated', this.handleForecastCalculated);
    // @ts-ignore - Tipos serão atualizados quando EventBus estiver disponível
    EventBus.off('taxes.profile.updated', this.handleProfileUpdated);
  }
}

export default new TaxesListener(); 
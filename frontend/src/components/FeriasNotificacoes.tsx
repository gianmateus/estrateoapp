import React, { useState } from 'react';
import { useEventBus } from '../hooks/useEventBus';
import { EventPayloadMap } from '../types/EventTypes';
import { FERIAS_EVENTS } from '../constants/events';

interface Notificacao {
  id: string;
  tipo: typeof FERIAS_EVENTS[keyof typeof FERIAS_EVENTS];
  mensagem: string;
  timestamp: Date;
}

const FeriasNotificacoes: React.FC = () => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);

  // Escuta eventos de férias registradas
  useEventBus(FERIAS_EVENTS.REGISTRADAS, (payload: EventPayloadMap[typeof FERIAS_EVENTS.REGISTRADAS]) => {
    const novaNotificacao: Notificacao = {
      id: Math.random().toString(36).substr(2, 9),
      tipo: FERIAS_EVENTS.REGISTRADAS,
      mensagem: `Férias registradas para ${payload.funcionarioNome} de ${new Date(payload.dataInicio).toLocaleDateString()} até ${new Date(payload.dataFim).toLocaleDateString()}`,
      timestamp: new Date()
    };

    setNotificacoes(prev => [novaNotificacao, ...prev].slice(0, 5));
  }, []);

  // Escuta eventos de férias aprovadas
  useEventBus(FERIAS_EVENTS.APROVADAS, (payload: EventPayloadMap[typeof FERIAS_EVENTS.APROVADAS]) => {
    const novaNotificacao: Notificacao = {
      id: Math.random().toString(36).substr(2, 9),
      tipo: FERIAS_EVENTS.APROVADAS,
      mensagem: `Férias de ${payload.funcionarioNome} foram aprovadas por ${payload.aprovadoPor}`,
      timestamp: new Date()
    };

    setNotificacoes(prev => [novaNotificacao, ...prev].slice(0, 5));
  }, []);

  // Escuta eventos de férias rejeitadas
  useEventBus(FERIAS_EVENTS.REJEITADAS, (payload: EventPayloadMap[typeof FERIAS_EVENTS.REJEITADAS]) => {
    const novaNotificacao: Notificacao = {
      id: Math.random().toString(36).substr(2, 9),
      tipo: FERIAS_EVENTS.REJEITADAS,
      mensagem: `Férias de ${payload.funcionarioNome} foram rejeitadas por ${payload.rejeitadoPor}. Motivo: ${payload.motivo}`,
      timestamp: new Date()
    };

    setNotificacoes(prev => [novaNotificacao, ...prev].slice(0, 5));
  }, []);

  const getCorNotificacao = (tipo: Notificacao['tipo']) => {
    switch (tipo) {
      case FERIAS_EVENTS.REGISTRADAS:
        return 'bg-blue-100 border-blue-500';
      case FERIAS_EVENTS.APROVADAS:
        return 'bg-green-100 border-green-500';
      case FERIAS_EVENTS.REJEITADAS:
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 space-y-2">
      {notificacoes.map(notificacao => (
        <div
          key={notificacao.id}
          className={`p-4 rounded-lg shadow-lg border-l-4 ${getCorNotificacao(notificacao.tipo)}`}
        >
          <p className="text-sm text-gray-800">{notificacao.mensagem}</p>
          <p className="text-xs text-gray-500 mt-1">
            {notificacao.timestamp.toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeriasNotificacoes; 
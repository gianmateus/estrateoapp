import React, { useState } from 'react';
import { useEventBus, useEventListenerCount, useEventEmitter } from '../hooks/useEventBus';
import { EventPayloadMap } from '../types/EventTypes';
import { FERIAS_EVENTS } from '../constants/events';

/**
 * Componente de exemplo que demonstra o uso do EventBus
 */
const EventBusExample: React.FC = () => {
  const [lastEvent, setLastEvent] = useState<EventPayloadMap[typeof FERIAS_EVENTS.REGISTRADAS] | null>(null);
  const listenerCount = useEventListenerCount(FERIAS_EVENTS.REGISTRADAS);
  const emitEvent = useEventEmitter();

  // Registra um listener para o evento de férias registradas
  useEventBus(FERIAS_EVENTS.REGISTRADAS, (payload: EventPayloadMap[typeof FERIAS_EVENTS.REGISTRADAS]) => {
    setLastEvent(payload);
  }, []);

  const handleEmitEvent = () => {
    const payload: EventPayloadMap[typeof FERIAS_EVENTS.REGISTRADAS] = {
      funcionarioId: '123',
      funcionarioNome: 'João Silva',
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        motivo: 'Férias anuais',
        dataRegistro: new Date().toISOString()
      }
    };

    // Emite o evento
    emitEvent(FERIAS_EVENTS.REGISTRADAS, payload);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Exemplo de EventBus</h2>
      
      <div className="mb-4">
        <p>Número de listeners ativos: {listenerCount}</p>
      </div>

      <button
        onClick={handleEmitEvent}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Emitir Evento
      </button>

      {lastEvent && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Último Evento Recebido:</h3>
          <pre className="text-sm">
            {JSON.stringify(lastEvent, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default EventBusExample; 
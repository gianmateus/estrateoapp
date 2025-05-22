import React from 'react';
import { useEventEmitter } from '../hooks/useEventBus';
import { EventPayloadMap } from '../types/EventTypes';
import { FERIAS_EVENTS } from '../constants/events';

interface FeriasAprovacaoProps {
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string;
  dataFim: string;
}

const FeriasAprovacao: React.FC<FeriasAprovacaoProps> = ({
  funcionarioId,
  funcionarioNome,
  dataInicio,
  dataFim
}) => {
  const emitEvent = useEventEmitter();

  const handleAprovar = () => {
    emitEvent(FERIAS_EVENTS.APROVADAS, {
      funcionarioId,
      funcionarioNome,
      dataInicio,
      dataFim,
      aprovadoPor: 'Gestor',
      metadata: {
        dataAprovacao: new Date().toISOString()
      }
    });
  };

  const handleRejeitar = (motivo: string) => {
    emitEvent(FERIAS_EVENTS.REJEITADAS, {
      funcionarioId,
      funcionarioNome,
      motivo,
      rejeitadoPor: 'Gestor',
      metadata: {
        dataInicio,
        dataFim,
        dataRejeicao: new Date().toISOString()
      }
    });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Aprovação de Férias</h3>
      <div className="mb-4">
        <p><strong>Funcionário:</strong> {funcionarioNome}</p>
        <p><strong>Período:</strong> {new Date(dataInicio).toLocaleDateString()} até {new Date(dataFim).toLocaleDateString()}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleAprovar}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Aprovar
        </button>
        <button
          onClick={() => handleRejeitar('Período não adequado')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Rejeitar
        </button>
      </div>
    </div>
  );
};

export default FeriasAprovacao; 
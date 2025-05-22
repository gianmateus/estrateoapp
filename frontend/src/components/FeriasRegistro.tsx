import React, { useState } from 'react';
import { useEventEmitter } from '../hooks/useEventBus';
import { FERIAS_EVENTS } from '../constants/events';

interface FeriasRegistroProps {
  funcionarioId: string;
  funcionarioNome: string;
}

const FeriasRegistro: React.FC<FeriasRegistroProps> = ({
  funcionarioId,
  funcionarioNome
}) => {
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [motivo, setMotivo] = useState('');
  const emitEvent = useEventEmitter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    emitEvent(FERIAS_EVENTS.REGISTRADAS, {
      funcionarioId,
      funcionarioNome,
      dataInicio,
      dataFim,
      metadata: {
        motivo,
        dataRegistro: new Date().toISOString()
      }
    });

    // Limpa o formulário
    setDataInicio('');
    setDataFim('');
    setMotivo('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Registro de Férias</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Funcionário
          </label>
          <p className="mt-1 text-gray-900">{funcionarioNome}</p>
        </div>

        <div>
          <label htmlFor="dataInicio" className="block text-sm font-medium text-gray-700">
            Data de Início
          </label>
          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dataFim" className="block text-sm font-medium text-gray-700">
            Data de Fim
          </label>
          <input
            type="date"
            id="dataFim"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-gray-700">
            Motivo
          </label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Registrar Férias
        </button>
      </form>
    </div>
  );
};

export default FeriasRegistro; 
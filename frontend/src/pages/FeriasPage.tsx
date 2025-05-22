import React, { useState } from 'react';
import FeriasRegistro from '../components/FeriasRegistro';
import FeriasAprovacao from '../components/FeriasAprovacao';
import FeriasNotificacoes from '../components/FeriasNotificacoes';

// Dados mockados para exemplo
const feriasPendentes = [
  {
    id: '1',
    funcionarioId: '123',
    funcionarioNome: 'João Silva',
    dataInicio: '2024-07-01',
    dataFim: '2024-07-15',
    motivo: 'Férias anuais'
  },
  {
    id: '2',
    funcionarioId: '456',
    funcionarioNome: 'Maria Santos',
    dataInicio: '2024-08-01',
    dataFim: '2024-08-15',
    motivo: 'Férias anuais'
  }
];

const FeriasPage: React.FC = () => {
  const [isGestor, setIsGestor] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Gestão de Férias</h1>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={isGestor}
                  onChange={(e) => setIsGestor(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Modo Gestor</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {!isGestor && (
              <div>
                <FeriasRegistro
                  funcionarioId="123"
                  funcionarioNome="João Silva"
                />
              </div>
            )}

            {isGestor && (
              <div>
                {feriasPendentes.map(ferias => (
                  <FeriasAprovacao
                    key={ferias.id}
                    funcionarioId={ferias.funcionarioId}
                    funcionarioNome={ferias.funcionarioNome}
                    dataInicio={ferias.dataInicio}
                    dataFim={ferias.dataFim}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <FeriasNotificacoes />
    </div>
  );
};

export default FeriasPage; 
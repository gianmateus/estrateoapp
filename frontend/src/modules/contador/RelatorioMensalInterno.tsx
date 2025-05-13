import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalSelecaoPeriodo from './ModalSelecaoPeriodo';
import { gerarPDFRelatorioInterno } from './utils/pdfRelatorioInterno';
import api from '../../services/api';
import { CircularProgress } from '@mui/material';
import '../../styles/contador.css';

interface RelatorioMensalInternoProps {
  onSuccess?: (mensagem: string) => void;
  onError?: (mensagem: string) => void;
}

const RelatorioMensalInterno: React.FC<RelatorioMensalInternoProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { t } = useTranslation();
  const [modalAberto, setModalAberto] = useState(false);
  const [gerando, setGerando] = useState(false);
  
  // Abrir modal de seleção de período
  const handleAbrirModal = () => {
    setModalAberto(true);
  };
  
  // Fechar modal de seleção de período
  const handleFecharModal = () => {
    setModalAberto(false);
  };
  
  // Carregar dados e gerar relatório
  const handleConfirmarGeracao = async (mes: string, ano: string) => {
    setGerando(true);
    try {
      // Chamar o endpoint para obter os dados
      const response = await api.get(`/relatorio-interno`, {
        params: { mes: `${ano}-${mes}` }
      });
      
      // Se houver erro, lançar exceção
      if (!response.data || response.status !== 200) {
        throw new Error('Erro ao recuperar dados para o relatório');
      }
      
      // Preparar dados para o PDF
      const dados = {
        nomeEmpresa: response.data.nomeEmpresa || 'Empresa',
        mes,
        ano,
        totalEntradas: response.data.financeiro?.totalEntradas || 0,
        totalSaidas: response.data.financeiro?.totalSaidas || 0,
        funcionarios: response.data.funcionarios || [],
        produtos: response.data.estoque || [],
        vatPercentual: response.data.impostos?.vatPercentual || 19,
        vatValor: response.data.impostos?.vatValor || 0,
        gewerbesteuerValor: response.data.impostos?.gewerbesteuerValor || 0
      };
      
      // Gerar PDF e abrir em nova aba
      const pdfUrl = gerarPDFRelatorioInterno(dados);
      window.open(pdfUrl, '_blank');
      
      // Fechar modal e mostrar mensagem de sucesso
      setModalAberto(false);
      if (onSuccess) {
        onSuccess('Relatório gerado com sucesso');
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      
      // Mensagem de erro simulada para desenvolvimento (remover em produção)
      const dadosMock = {
        nomeEmpresa: 'Estrateo GmbH',
        mes,
        ano,
        totalEntradas: 15680.45,
        totalSaidas: 9785.30,
        funcionarios: [
          { nome: 'Maria Silva', horasSemanais: 40, salarioBruto: 3500 },
          { nome: 'João Santos', horasSemanais: 20, salarioBruto: 1800 },
          { nome: 'Anna Schmidt', horasSemanais: 40, salarioBruto: 4200 }
        ],
        produtos: [
          { nome: 'Produto A', quantidade: 45, movimentacao: 12, abaixoMinimo: false },
          { nome: 'Produto B', quantidade: 5, movimentacao: -3, abaixoMinimo: true },
          { nome: 'Produto C', quantidade: 78, movimentacao: 25, abaixoMinimo: false },
          { nome: 'Produto D', quantidade: 2, movimentacao: -8, abaixoMinimo: true }
        ],
        vatPercentual: 19,
        vatValor: 2979.29,
        gewerbesteuerValor: 1200.50
      };
      
      // Gerar PDF com dados mock para testes
      const pdfUrl = gerarPDFRelatorioInterno(dadosMock);
      window.open(pdfUrl, '_blank');
      
      // Fechar modal e mostrar mensagem simulando sucesso (para desenvolvimento)
      setModalAberto(false);
      if (onSuccess) {
        onSuccess('Relatório gerado com dados simulados (modo desenvolvimento)');
      }
      
      /* Comentar a linha acima e descomentar abaixo para produção
      if (onError) {
        onError('Erro ao gerar relatório. Tente novamente.');
      }
      */
    } finally {
      setGerando(false);
    }
  };
  
  // Botão de geração de relatório
  return (
    <>
      <button
        onClick={handleAbrirModal}
        className="btn-gerar"
        disabled={gerando}
      >
        {gerando ? <CircularProgress size={20} color="inherit" /> : 'GERAR'}
      </button>
      
      <ModalSelecaoPeriodo
        open={modalAberto}
        onClose={handleFecharModal}
        onConfirm={handleConfirmarGeracao}
      />
    </>
  );
};

export default RelatorioMensalInterno; 
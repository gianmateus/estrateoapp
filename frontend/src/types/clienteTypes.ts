// Tipo de cliente
export type TipoCliente = 'pessoa_fisica' | 'pessoa_juridica';

// Status do cliente
export type StatusCliente = 'ativo' | 'inativo' | 'prospecto' | 'arquivado';

// Tipos de interação com o cliente
export type TipoInteracao = 'email' | 'telefonema' | 'reuniao' | 'proposta' | 'venda' | 'suporte' | 'outro';

// Tipos de documento do cliente
export type TipoDocumento = 'contrato' | 'identidade' | 'cnpj' | 'comprovante' | 'proposta' | 'outro';

// Interface para cliente
export interface Cliente {
  id: string;
  tipo: TipoCliente;
  nome: string;
  empresa?: string;
  email?: string;
  telefone?: string;
  documentoPrincipal?: string;
  endereco?: string;
  website?: string;
  segmento?: string;
  anotacoes?: string;
  status: StatusCliente;
  dataCadastro: string;
  dataAtualizacao: string;
  _count?: {
    interacoes: number;
    documentos: number;
  };
}

// Interface para interação com cliente
export interface InteracaoCliente {
  id: string;
  clienteId: string;
  tipo: TipoInteracao;
  titulo: string;
  descricao: string;
  data: string;
  responsavel?: string;
  resultado?: string;
  proximaAcao?: string;
  dataProximaAcao?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  cliente?: {
    id: string;
    nome: string;
    empresa?: string;
  };
}

// Interface para documento de cliente
export interface DocumentoCliente {
  id: string;
  clienteId: string;
  tipo: TipoDocumento;
  nome: string;
  descricao?: string;
  caminhoArquivo: string;
  tamanhoBytes?: number;
  mimeType?: string;
  dataCriacao: string;
  dataAtualizacao: string;
  cliente?: {
    id: string;
    nome: string;
    empresa?: string;
  };
}

// Interface para filtros de cliente
export interface ClienteFilters {
  nome?: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  documentoPrincipal?: string;
  tipo?: TipoCliente;
  status?: StatusCliente;
  segmento?: string;
}

// Interface para formulário de cliente
export interface ClienteFormValues {
  id?: string;
  tipo: TipoCliente;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  documentoPrincipal: string;
  endereco: string;
  website: string;
  segmento: string;
  anotacoes: string;
  status: StatusCliente;
}

// Interface para formulário de interação
export interface InteracaoFormValues {
  id?: string;
  clienteId: string;
  tipo: TipoInteracao;
  titulo: string;
  descricao: string;
  data: Date | null;
  responsavel: string;
  resultado: string;
  proximaAcao: string;
  dataProximaAcao: Date | null;
}

// Interface para estatísticas de clientes
export interface ClienteStats {
  ativo: number;
  inativo: number;
  prospecto: number;
  arquivado: number;
} 
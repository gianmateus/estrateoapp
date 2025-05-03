/**
 * Tipos para o módulo de Clientes e Contatos
 * Types for the Clients and Contacts module
 */

// Tipo de cliente
// Client type
export type TipoCliente = 'pessoa_fisica' | 'pessoa_juridica';

// Status do cliente
// Client status
export type StatusCliente = 'ativo' | 'inativo' | 'prospecto' | 'arquivado';

// Tipos de interação com o cliente
// Client interaction types
export type TipoInteracao = 'email' | 'telefonema' | 'reuniao' | 'proposta' | 'venda' | 'suporte' | 'outro';

// Tipos de documento do cliente
// Client document types
export type TipoDocumento = 'contrato' | 'identidade' | 'cnpj' | 'comprovante' | 'proposta' | 'outro';

// Interface para criação de cliente
// Client creation interface
export interface CreateClienteDTO {
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
  status?: StatusCliente;
}

// Interface para atualização de cliente
// Client update interface
export interface UpdateClienteDTO extends Partial<CreateClienteDTO> {
  id: string;
}

// Interface para criação de interação com cliente
// Client interaction creation interface
export interface CreateInteracaoClienteDTO {
  clienteId: string;
  tipo: TipoInteracao;
  titulo: string;
  descricao: string;
  data?: Date;
  responsavel?: string;
  resultado?: string;
  proximaAcao?: string;
  dataProximaAcao?: Date;
}

// Interface para atualização de interação com cliente
// Client interaction update interface
export interface UpdateInteracaoClienteDTO extends Partial<CreateInteracaoClienteDTO> {
  id: string;
}

// Interface para criação de documento de cliente
// Client document creation interface
export interface CreateDocumentoClienteDTO {
  clienteId: string;
  tipo: TipoDocumento;
  nome: string;
  descricao?: string;
  caminhoArquivo: string;
  tamanhoBytes?: number;
  mimeType?: string;
}

// Interface para atualização de documento de cliente
// Client document update interface
export interface UpdateDocumentoClienteDTO extends Partial<CreateDocumentoClienteDTO> {
  id: string;
}

// Filtros para listagem de clientes
// Client listing filters
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
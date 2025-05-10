import { eventBus } from '../EventBus';
import { Ferias } from '../funcionariosListener';

describe('EventBus', () => {
  beforeEach(() => {
    // Limpa todos os listeners antes de cada teste
    eventBus.removeAllListeners('ferias.registradas');
  });

  it('deve emitir e receber eventos corretamente', () => {
    const mockCallback = jest.fn();
    const feriasPayload: Ferias = {
      id: 'ferias-123',
      funcionarioId: 'func-123',
      funcionarioNome: 'João Silva',
      dataInicio: new Date('2024-03-01'),
      dataFim: new Date('2024-03-15'),
      observacoes: 'Férias programadas'
    };

    // Registra o listener
    eventBus.on('ferias.registradas', mockCallback);

    // Emite o evento
    eventBus.emit('ferias.registradas', feriasPayload);

    // Verifica se o callback foi chamado com o payload correto
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith(feriasPayload);
  });

  it('deve remover listeners corretamente', () => {
    const mockCallback = jest.fn();
    const feriasPayload: Ferias = {
      id: 'ferias-123',
      funcionarioId: 'func-123',
      funcionarioNome: 'João Silva',
      dataInicio: new Date('2024-03-01'),
      dataFim: new Date('2024-03-15'),
      observacoes: 'Férias programadas'
    };

    // Registra o listener
    eventBus.on('ferias.registradas', mockCallback);

    // Remove o listener
    eventBus.off('ferias.registradas', mockCallback);

    // Emite o evento
    eventBus.emit('ferias.registradas', feriasPayload);

    // Verifica se o callback não foi chamado
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('deve manter múltiplos listeners para o mesmo evento', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    const feriasPayload: Ferias = {
      id: 'ferias-123',
      funcionarioId: 'func-123',
      funcionarioNome: 'João Silva',
      dataInicio: new Date('2024-03-01'),
      dataFim: new Date('2024-03-15'),
      observacoes: 'Férias programadas'
    };

    // Registra os listeners
    eventBus.on('ferias.registradas', mockCallback1);
    eventBus.on('ferias.registradas', mockCallback2);

    // Emite o evento
    eventBus.emit('ferias.registradas', feriasPayload);

    // Verifica se ambos os callbacks foram chamados
    expect(mockCallback1).toHaveBeenCalledWith(feriasPayload);
    expect(mockCallback2).toHaveBeenCalledWith(feriasPayload);
  });
}); 
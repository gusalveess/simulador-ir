import { Test, TestingModule } from '@nestjs/testing';
import { DeclaracoesController } from './declaracoes.controller';
import { DeclaracoesService } from './declaracoes.service';
import { CriarDeclaracaoDto, AtualizarDeclaracaoDto } from '../../shared/declaracao.dto';
import { HttpException } from '@nestjs/common';

describe('DeclaracoesController', () => {
  let controller: DeclaracoesController;
  let service: DeclaracoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeclaracoesController],
      providers: [
        {
          provide: DeclaracoesService,
          useValue: {
            criarDeclaracao: jest.fn(),
            listarDeclaracoesPorUsuario: jest.fn(),
            obterDeclaracao: jest.fn(),
            atualizarDeclaracao: jest.fn(),
            deletarDeclaracao: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeclaracoesController>(DeclaracoesController);
    service = module.get<DeclaracoesService>(DeclaracoesService);
  });

  it('should create a declaration successfully', async () => {
    const userId = 1;
    const dto = { ano: 2025, dados: {} };
    const declaracaoMock = { id: 1, ano: 2025, dados: {}, status: 'Pendente', criadoEm: new Date() };

    jest.spyOn(service, 'criarDeclaracao').mockImplementation(jest.fn().mockResolvedValue(declaracaoMock));

    const result = await controller.criarDeclaracao(userId, dto);

    expect(result.message).toBe('Declaração criada com sucesso!');
    expect(result.declaracao).toEqual(declaracaoMock);
  });

  it('should list declarations for a user', async () => {
    const userId = 1;
    const declaracoes = [{ id: 1, ano: 2025, dados: {} }];
    jest.spyOn(service, 'listarDeclaracoesPorUsuario').mockImplementation(jest.fn().mockResolvedValue(declaracoes));

    const result = await controller.listarDeclaracoes(userId);
    
    expect(result).toEqual(declaracoes);
    expect(service.listarDeclaracoesPorUsuario).toHaveBeenCalledWith(userId);
  });

  it('should return a specific declaration for a user', async () => {
    const userId = 1;
    const id = 1;
    const declaracao = { id, ano: 2025, dados: {} };
    jest.spyOn(service, 'obterDeclaracao').mockImplementation(jest.fn().mockResolvedValue(declaracao));

    const result = await controller.obterDeclaracao(userId, id);
    
    expect(result).toEqual(declaracao);
    expect(service.obterDeclaracao).toHaveBeenCalledWith(id, userId);
  });

  it('should update a declaration successfully', async () => {
    const userId = 1;
    const id = 1;
    const dto: AtualizarDeclaracaoDto = { dados: {} };
    const declaracaoAtualizada = { id, ano: 2025, dados: {} };
    jest.spyOn(service, 'atualizarDeclaracao').mockImplementation(jest.fn().mockResolvedValue(declaracaoAtualizada));

    const result = await controller.atualizarDeclaracao(userId, id, dto);
    
    expect(result).toEqual({
      message: 'Declaração atualizada com sucesso!',
      declaracaoAtualizada,
    });
    expect(service.atualizarDeclaracao).toHaveBeenCalledWith(id, userId, dto);
  });

  it('should delete a declaration successfully', async () => {
    const userId = 1;
    const id = 1;
    jest.spyOn(service, 'deletarDeclaracao').mockResolvedValue(true);

    const result = await controller.deletarDeclaracao(userId, id);
    
    expect(result).toEqual({ message: 'Declaração removida com sucesso!' });
    expect(service.deletarDeclaracao).toHaveBeenCalledWith(id, userId);
  });

  it('should throw error if no declarations are found for user', async () => {
    const userId = 1;
    jest.spyOn(service, 'listarDeclaracoesPorUsuario').mockResolvedValue([]);

    try {
      await controller.listarDeclaracoes(userId);
    } catch (error) {
      expect(error.response).toBe('Nenhuma declaração encontrada para este usuário.');
      expect(error.status).toBe(404);
    }
  });
});
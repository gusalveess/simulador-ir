import { Test, TestingModule } from '@nestjs/testing';
import { DeclaracoesController } from './declaracoes.controller';
import { DeclaracoesService } from './declaracoes.service';
import { CriarDeclaracaoDto, AtualizarDeclaracaoDto } from '../../shared/declaracao.dto';
import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

describe('DeclaracoesController', () => {
  let controller: DeclaracoesController;
  let service: DeclaracoesService;
  const mockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),  
    };
    return res as Response;
  };

  const res = mockResponse()

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

    await controller.criarDeclaracao(userId, dto, res);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Declaração criada com sucesso!',
      declaracao: declaracaoMock
    });
  });

  it('should list declarations for a user', async () => {
    const userId = 1;
    const declaracoes = [{ id: 1, ano: 2025, dados: {} }];
    jest.spyOn(service, 'listarDeclaracoesPorUsuario').mockImplementation(jest.fn().mockResolvedValue(declaracoes));

    await controller.listarDeclaracoes(userId, res);
    
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK)
    expect(res.json).toHaveBeenCalledWith({
      declaracoes,
    });
  });

  it('should return a specific declaration for a user', async () => {
    const userId = 1;
    const id = 1;
    const declaracao = { id, ano: 2025, dados: {} };
    jest.spyOn(service, 'obterDeclaracao').mockImplementation(jest.fn().mockResolvedValue(declaracao));

    await controller.obterDeclaracao(userId, id, res);
    
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK)
    expect(res.json).toHaveBeenCalledWith({
      userId,
      declaracao,
    });
    expect(service.obterDeclaracao).toHaveBeenCalledWith(id, userId);
  });

  it('should update a declaration successfully', async () => {
    const userId = 1;
    const id = 1;
    const dto: AtualizarDeclaracaoDto = { dados: {} };
    const declaracaoAtualizada = { id, ano: 2025, dados: {} };
    jest.spyOn(service, 'atualizarDeclaracao').mockImplementation(jest.fn().mockResolvedValue(declaracaoAtualizada));

    await controller.atualizarDeclaracao(userId, id, dto, res);
    
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Declaração atualizada com sucesso!',
      declaracaoAtualizada,
    });
    expect(service.atualizarDeclaracao).toHaveBeenCalledWith(id, userId, dto);
  });

  it('should delete a declaration successfully', async () => {
    const userId = 1;
    const id = 1;
    jest.spyOn(service, 'deletarDeclaracao').mockResolvedValue(true);

    await controller.deletarDeclaracao(userId, id, res);
    
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK)
    expect(res.json).toHaveBeenCalledWith({ message: 'Declaração removida com sucesso!' });
    expect(service.deletarDeclaracao).toHaveBeenCalledWith(id, userId);
  });

  it('should throw error if no declarations are found for user', async () => {
    const userId = 1;
    jest.spyOn(service, 'listarDeclaracoesPorUsuario').mockResolvedValue([]);

    try {
      await controller.listarDeclaracoes(userId, res);
    } catch (error) {
      console.log(error)
      expect(error.status).toBe(HttpStatus.NOT_FOUND)
      expect(error.json).toHaveBeenCalledWith({
        message: 'Nenhuma declaração encontrada para este usuário.',
      });
    }
  });
});
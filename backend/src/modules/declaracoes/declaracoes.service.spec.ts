import { Test, TestingModule } from '@nestjs/testing';
import { DeclaracoesService } from './declaracoes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Declaracao } from './declaracao.entity';
import { User } from '../users/user.entity';

describe('DeclaracoesService', () => {
  let service: DeclaracoesService;
  let repository: any;

  beforeEach(async () => {
    repository = {
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeclaracoesService,
        {
          provide: getRepositoryToken(Declaracao),
          useValue: repository, 
        },
      ],
    }).compile();

    service = module.get<DeclaracoesService>(DeclaracoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a declaration', async () => {
    const userId = 1;
    const ano = 2025;
    const dados = {};
    
    const mockDeclaracao = { 
      id: 1, 
      usuario: { id: userId }, 
      ano, 
      dados, 
      status: 'não submetida',
    };
    repository.create.mockReturnValue(mockDeclaracao);
    repository.save.mockResolvedValue(mockDeclaracao);

    const result = await service.criarDeclaracao(userId, ano, dados);
    expect(result).toEqual(mockDeclaracao);
    expect(repository.create).toHaveBeenCalledWith({
      usuario: { id: userId } as User,
      ano,
      dados,
      status: 'não submetida',
    });
    expect(repository.save).toHaveBeenCalledWith(mockDeclaracao);
  });

  it('should list declarations for a user', async () => {
    const userId = 1;
    const mockDeclaracoes = [{ id: 1, usuario: { id: userId }, ano: 2025, dados: {} }];
    
    repository.find.mockResolvedValue(mockDeclaracoes);

    const result = await service.listarDeclaracoesPorUsuario(userId);
    expect(result).toEqual(mockDeclaracoes);
    expect(repository.find).toHaveBeenCalledWith({
      where: { usuario: { id: userId } },
      order: { ano: 'DESC' },
    });
  });

  it('should update a declaration', async () => {
    const userId = 1;
    const id = 1;
    const dto = { ano: 2026, dados: {} };
    const mockDeclaracao = { id, usuario: { id: userId }, ...dto };
    
    repository.findOne.mockResolvedValue(mockDeclaracao);
    repository.save.mockResolvedValue(mockDeclaracao);

    const updated = await service.atualizarDeclaracao(id, userId, dto);
    expect(updated).toEqual(mockDeclaracao);
    expect(repository.save).toHaveBeenCalledWith(mockDeclaracao);
  });

  it('should delete a declaration', async () => {
    const userId = 1;
    const id = 1;
    repository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.deletarDeclaracao(id, userId);
    expect(result).toBe(true);
    expect(repository.delete).toHaveBeenCalledWith({ id, usuario: { id: userId } });
  });
});
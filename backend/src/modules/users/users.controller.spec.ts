import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(), // Mock da função utilizada no controller
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user info without sensitive data', async () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      nome: 'João Silva',
      email: 'joao@email.com',
      senhaHash: 'senha-secreta',
      criadoEm: new Date(),
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(service, 'findById').mockImplementation(jest.fn().mockResolvedValue(mockUser));

    await controller.listarInformacoes(userId, res as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
    expect(res.json).toHaveBeenCalledWith({
      info: {
        id: userId,
        nome: 'João Silva',
        email: 'joao@email.com',
      },
    });
  });

  it('should return 404 if user is not found', async () => {
    const userId = 2;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(service, 'findById').mockResolvedValue(null);

    await controller.listarInformacoes(userId, res as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Usuário não encontrado',
    });
  });

  it('should return 500 if an error occurs', async () => {
    const userId = 3;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.spyOn(service, 'findById').mockRejectedValue(new Error('Erro inesperado'));

    await controller.listarInformacoes(userId, res as any);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Erro ao recuperar as informações do usuário',
    });
  });
});

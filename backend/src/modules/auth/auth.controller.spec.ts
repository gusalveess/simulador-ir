import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { User } from '../users/user.entity';
import { HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let usersRepository: any;

  beforeEach(async () => {
    const mockUsersRepository = {
      findOne: jest.fn().mockResolvedValue({ 
        id: 1,
        nome: 'Gustavo Alves',
        email: 'gustavo_teste@gmail.com',
        senhaHash: 'hashedpassword',
        twoFactorSecret: 'mockSecret',
        is2FAEnabled: true,
      }),
      save: jest.fn().mockResolvedValue({ 
        id: 1,
        nome: 'Gustavo Alves',
        email: 'gustavo_teste@gmail.com',
        senhaHash: 'hashedpassword',
        twoFactorSecret: 'mockSecret',
        is2FAEnabled: true,
      }),
    };


    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User), 
          useValue: mockUsersRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockJwtToken'),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(User)); 
  });

  describe('register', () => {
    const mockResponse = () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),  
      };
      return res as Response;
    };

    const res = mockResponse()

    it('should return error if fields are missing', async () => {
      const body = { nome: '', email: '', senha: '' };

      await controller.register(body, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Nome, E-mail e Senha são obrigatórios.',
      });
    });

    it('should return error if email is invalid', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const body = { nome: 'Test User', email: 'invalid-email', senha: 'password123' };

      await controller.register(body, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email inválido.',
      });
    });

    it('should return error if email is already registered', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const body = { nome: 'Test User', email: 'test@example.com', senha: 'password123' };
      
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.nome = 'Usuário Teste';
      mockUser.email = 'test@example.com';
      mockUser.senhaHash = 'hashedpassword123';
      mockUser.criadoEm = new Date();
      mockUser.twoFactorSecret = null;
      mockUser.is2FAEnabled = false;
      mockUser.declaracoes = [];
      
      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(mockUser);

      await controller.register(body, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email já registrado.',
      });
    });

    it('should be register a new user successfully', async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const body = { nome: 'Test User', email: 'test@example.com', senha: 'password123' };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValueOnce(null);
      const mockUser = new User();
      mockUser.id = 1;
      mockUser.nome = 'Usuário Teste';
      mockUser.email = 'test@example.com';
      mockUser.senhaHash = 'hashedpassword123';
      mockUser.criadoEm = new Date();
      mockUser.twoFactorSecret = null;
      mockUser.is2FAEnabled = false;
      
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockUser);

      await controller.register(body, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário registrado com sucesso!',
        userId: 1,
      });
    });
  });

  describe('login', () => {

    const mockResponse = () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),  
      };
      return res as Response;
    };

    const res = mockResponse()


    it('should login successfully without 2FA', async () => {
      const loginDto = { email: 'gustavo_teste@gmail.com', senha: 'password123' };
      const user = { id: 1, email: 'gustavo_teste@gmail.com', senhaHash: 'hashedpassword' };
      const token = 'mockJwtToken';

      jest.spyOn(usersService, 'validateUserCredentials').mockResolvedValue(user as any);
      jest.spyOn(authService, 'generateJwt').mockResolvedValue(token);

      await controller.login(loginDto, res);


      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.OK,
        message: 'Login realizado com sucesso!',
        token,
        user: user.id
      });

      expect(usersService.validateUserCredentials).toHaveBeenCalledWith(loginDto.email, loginDto.senha);
      expect(authService.generateJwt).toHaveBeenCalledWith(user);
    });

    it('should throw an error if credentials are invalid', async () => {
      const loginDto = { email: 'gustavo_teste@gmail.com', senha: 'wrongpassword' };
    
      jest.spyOn(usersService, 'validateUserCredentials').mockResolvedValue(null);
    
      try {
        await controller.login(loginDto, res);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(e.response).toBe('Credenciais inválidas.');
      }
    });

    it('should throw an error if 2FA code is invalid', async () => {
      const loginDto = { email: 'gustavo_teste@gmail.com', senha: 'password123', token2fa: '123456' };
      const user = { id: 1, email: 'gustavo_teste@gmail.com', senhaHash: 'hashedpassword', twoFactorSecret: 'mockSecret' };
    
      jest.spyOn(usersService, 'validateUserCredentials').mockResolvedValue(user as any);
      jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(false);
    
      try {
        await controller.login(loginDto, res);
      } catch (e) {
        expect(e.status).toBe(HttpStatus.UNAUTHORIZED);
        expect(e.response.json).toBe('Código de 2FA inválido.');
      }
    });
  });

  describe('enableTwoFactorAuth', () => {

    const mockResponse = () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),  
      };
      return res as Response;
    };

    const res = mockResponse()

    it('should enable two-factor authentication successfully', async () => {
      const userId = 1;
      const user = { id: userId, email: 'gustavo_teste@gmail.com', twoFactorSecret: null };
      const secret = 'mockSecret';
      const qrCodeUrl = 'mockQRCodeUrl';
    
      jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);
      jest.spyOn(usersService, 'generate2FA').mockResolvedValue({ secret, qrCodeUrl });
      jest.spyOn(usersService, 'updateTwoFactorSecret').mockResolvedValue(null);
    
      await controller.enableTwoFactorAuth(userId, res);
    
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Autenticação de dois fatores ativada com sucesso.',
        qrCodeUrl,
        statusCode: HttpStatus.OK
      });
    
      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(usersService.generate2FA).toHaveBeenCalledWith(userId);
      expect(usersService.updateTwoFactorSecret).toHaveBeenCalledWith(userId, secret);
    });

    it('should return a message if 2FA is already enabled', async () => {
      const userId = 1;
      const user = { id: userId, email: 'gustavo_teste@gmail.com', twoFactorSecret: 'mockSecret' };
    
      jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);
    
      const generate2FAMock = jest.spyOn(usersService, 'generate2FA').mockImplementation(() =>
        Promise.resolve({ secret: 'mockSecret', qrCodeUrl: 'mockQRCodeUrl' })
      );
    
      await controller.enableTwoFactorAuth(userId, res);
    
      expect(res.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(res.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'A autenticação de dois fatores já está ativada para este usuário.',
      });
    
      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(generate2FAMock).not.toHaveBeenCalled();
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;

      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      try {
        await controller.enableTwoFactorAuth(userId, res);
      } catch (e) {
        console.log(e)
        expect(e.status).toBe(HttpStatus.NOT_FOUND);
        expect(e.res).toBe('Usuário não encontrado.');
      }
    });
  });

  describe('getProfile', () => {
    it('should return the authenticated user profile', async () => {
      const user = { id: 1, nome: 'Gustavo Alves', email: 'gustavo_teste@gmail.com' };
      const req = { user };

      const result = await controller.getProfile(req);

      expect(result).toEqual({
        message: 'Perfil do usuário autenticado.',
        user,
      });
    });
  });
});
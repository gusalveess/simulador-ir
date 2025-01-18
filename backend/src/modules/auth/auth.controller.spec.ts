import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as speakeasy from 'speakeasy';
import { User } from '../users/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

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
    it('should register a user successfully', async () => {
      const createUserDto = { nome: 'Gustavo Alves', email: 'gustavo_teste@gmail.com', senha: 'password123' };
      const user = { id: 1, ...createUserDto, senhaHash: 'hashedpassword' };

      jest.spyOn(usersService, 'create').mockResolvedValue(user as any);

      const result = await controller.register(createUserDto);

      expect(result).toEqual({
        message: 'Usuário registrado com sucesso!',
        userId: user.id,
      });

      expect(usersService.create).toHaveBeenCalledWith(createUserDto.nome, createUserDto.email, createUserDto.senha);
    });
  });

  describe('login', () => {
    it('should login successfully without 2FA', async () => {
      const loginDto = { email: 'gustavo_teste@gmail.com', senha: 'password123' };
      const user = { id: 1, email: 'gustavo_teste@gmail.com', senhaHash: 'hashedpassword' };
      const token = 'mockJwtToken';

      jest.spyOn(usersService, 'validateUserCredentials').mockResolvedValue(user as any);
      jest.spyOn(authService, 'generateJwt').mockResolvedValue(token);

      const result = await controller.login(loginDto);

      expect(result).toEqual({
        message: 'Login realizado com sucesso!',
        token,
      });

      expect(usersService.validateUserCredentials).toHaveBeenCalledWith(loginDto.email, loginDto.senha);
      expect(authService.generateJwt).toHaveBeenCalledWith(user);
    });

    it('should throw an error if credentials are invalid', async () => {
      const loginDto = { email: 'gustavo_teste@gmail.com', senha: 'wrongpassword' };
    
      jest.spyOn(usersService, 'validateUserCredentials').mockResolvedValue(null);
    
      try {
        await controller.login(loginDto);
      } catch (e) {
        expect(e.status).toBe(401);
        expect(e.response).toBe('Credenciais inválidas.');
      }
    });

    it('should throw an error if 2FA code is invalid', async () => {
      const loginDto = { email: 'gustavo_teste@gmail.com', senha: 'password123', token2fa: '123456' };
      const user = { id: 1, email: 'gustavo_teste@gmail.com', senhaHash: 'hashedpassword', twoFactorSecret: 'mockSecret' };
    
      jest.spyOn(usersService, 'validateUserCredentials').mockResolvedValue(user as any);
      jest.spyOn(speakeasy.totp, 'verify').mockReturnValue(false);
    
      try {
        await controller.login(loginDto);
      } catch (e) {
        expect(e.status).toBe(401);
        expect(e.response).toBe('Código de 2FA inválido.');
      }
    });
  });

  describe('enableTwoFactorAuth', () => {
    it('should enable two-factor authentication successfully', async () => {
      const userId = 1;
      const user = { id: userId, email: 'gustavo_teste@gmail.com', twoFactorSecret: null };
      const secret = 'mockSecret';
      const qrCodeUrl = 'mockQRCodeUrl';

      jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);
      jest.spyOn(usersService, 'generate2FA').mockResolvedValue({ secret, qrCodeUrl });
      jest.spyOn(usersService, 'updateTwoFactorSecret').mockResolvedValue(null);

      const result = await controller.enableTwoFactorAuth(userId);

      expect(result).toEqual({
        message: 'Autenticação de dois fatores ativada com sucesso.',
        qrCodeUrl,
      });

      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(usersService.generate2FA).toHaveBeenCalledWith(userId);
      expect(usersService.updateTwoFactorSecret).toHaveBeenCalledWith(userId, secret);
    });

    it('should return a message if 2FA is already enabled', async () => {
      const userId = 1;
      const user = { id: userId, email: 'gustavo_teste@gmail.com', twoFactorSecret: 'mockSecret' };
    
      jest.spyOn(usersService, 'findById').mockResolvedValue(user as any);
    
      const generate2FAMock = jest.spyOn(usersService, 'generate2FA').mockImplementation(() => Promise.resolve({ secret: 'mockSecret', qrCodeUrl: 'mockQRCodeUrl' }));
    
      const result = await controller.enableTwoFactorAuth(userId);
    
      expect(result).toEqual({
        message: 'A autenticação de dois fatores já está ativada para este usuário.',
      });
    
      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(generate2FAMock).not.toHaveBeenCalled(); 
    });

    it('should throw an error if user is not found', async () => {
      const userId = 1;

      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      try {
        await controller.enableTwoFactorAuth(userId);
      } catch (e) {
        expect(e.status).toBe(404);
        expect(e.response).toBe('Usuário não encontrado.');
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
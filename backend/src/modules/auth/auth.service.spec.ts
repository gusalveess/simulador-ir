import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedException } from '@nestjs/common';
import { User } from 'src/modules/users/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn().mockReturnValue('mockJwtToken'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const email = 'gustavo_teste@gmail.com';
      const senha = 'password123';
      const user = {
        id: 1,
        nome: 'Gustavo Alves',
        email: 'gustavo_teste@gmail.com',
        senhaHash: 'hashedpassword',
        criadoEm: new Date('2025-01-18T21:46:29.132Z'),
        is2FAEnabled: false,
        twoFactorSecret: null,
      };
    
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(jest.fn().mockResolvedValue(true));
    
      const result = await authService.validateUser(email, senha);
    
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        email: 'gustavo_teste@gmail.com',
        nome: 'Gustavo Alves',
      }));
    
      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(senha, user.senhaHash);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const email = 'gustavo_teste@gmail.com';
      const senha = 'wrongpassword';
      const user = { 
        id: 1, 
        email, 
        senhaHash: await bcrypt.hash('password123', 10),
        nome: 'Gustavo Alves',
        criadoEm: new Date(),
        twoFactorSecret: null,
        is2FAEnabled: false
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockImplementation(jest.fn().mockResolvedValue(false));

      try {
        await authService.validateUser(email, senha);
      } catch (e) {
        expect(e).toBeInstanceOf(UnauthorizedException);
        expect(e.message).toBe('Credenciais inválidas');
      }
    });
  });

  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      const user = { 
        id: 1, 
        email: 'gustavo_teste@gmail.com', 
        nome: 'Gustavo Alves',
        senhaHash: 'hashedpassword',
        criadoEm: new Date(),
        twoFactorSecret: null,
        is2FAEnabled: false
      };
    
      const token = 'mockJwtToken';
    
      const signSpy = jest.spyOn(jwtService, 'sign').mockReturnValue(token);
    
      const result = await authService.login(user);

      expect(result).toEqual({ access_token: token });
      expect(signSpy).toHaveBeenCalledWith({ email: user.email, sub: user.id });
    });
  });

  it('should generate JWT successfully', async () => {
    const user: Partial<User> = { id: 1, email: 'gustavo_teste@gmail.com' };
    
    jest.spyOn(jwtService, 'sign').mockReturnValue('mockJwtToken');
  
    const result = await authService.generateJwt(user as User);
    
    expect(result).toBe('mockJwtToken');
  });
});
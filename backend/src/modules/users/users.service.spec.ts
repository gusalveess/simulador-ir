import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { nome: 'Gustavo Alves', email: 'gustavo_teste@gmail.com', senha: 'password123' };
  
      const hashedPassword = await bcrypt.hash(createUserDto.senha, 10); // Gerando o hash real
  
      const mockUser = {
        ...createUserDto,
        senhaHash: hashedPassword,
        id: 1,
        criadoEm: new Date(),
        is2FAEnabled: false,
        twoFactorSecret: null,
      };
  
      usersRepository.save = jest.fn().mockResolvedValue(mockUser);
      usersRepository.create = jest.fn().mockReturnValue(mockUser);
  
      const result = await service.create(createUserDto.nome, createUserDto.email, createUserDto.senha);
  
      expect(result).toEqual(expect.objectContaining({
        nome: createUserDto.nome,
        email: createUserDto.email,
        senhaHash: expect.stringMatching(/^\$2a\$\d{2}\$.{53}$/),
        is2FAEnabled: false,
        twoFactorSecret: null,
      }));
  
      expect(usersRepository.create).toHaveBeenCalledWith({
        nome: createUserDto.nome,
        email: createUserDto.email,
        senhaHash: expect.stringMatching(/^\$2a\$\d{2}\$.{53}$/),
      });
  
      expect(usersRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        nome: createUserDto.nome,
        email: createUserDto.email,
        senhaHash: expect.stringMatching(/^\$2a\$\d{2}\$.{53}$/),
        is2FAEnabled: false,
        twoFactorSecret: null,
      }));
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: 1, nome: 'Gustavo Alves', email: 'gustavo_teste@gmail.com', senhaHash: 'hashedpassword' };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user as any);

      const result = await service.findByEmail('gustavo_teste@gmail.com');

      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'gustavo_teste@gmail.com' } });
    });
  });

  describe('generate2FA', () => {
    it('should generate a 2FA secret and QR code', async () => {
      const userId = 1;
      const secret = speakeasy.generateSecret({ length: 20 });
      jest.spyOn(speakeasy, 'generateSecret').mockReturnValue(secret);
      jest.spyOn(qrcode, 'toDataURL').mockResolvedValue('mockedQrCodeUrl');

      const result = await service.generate2FA(userId);

      expect(result.secret).toEqual(secret.base32);
      expect(result.qrCodeUrl).toEqual('mockedQrCodeUrl');
    });
  });

  describe('updateTwoFactorSecret', () => {
    it('should update the user\'s two-factor secret', async () => {
      const userId = 1;
      const secret = 'mockSecret';
      const user = { 
        id: userId, 
        nome: 'Gustavo Alves', 
        email: 'gustavo_teste@gmail.com', 
        senhaHash: 'hashedpassword', 
        criadoEm: new Date(),
        declaracoes: [],
      };
  
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(usersRepository, 'save').mockResolvedValue({ ...user, twoFactorSecret: secret, is2FAEnabled: true });
  
      const result = await service.updateTwoFactorSecret(userId, secret);
  
      expect(result).toEqual({ ...user, twoFactorSecret: secret, is2FAEnabled: true });
      expect(usersRepository.save).toHaveBeenCalledWith({ ...user, twoFactorSecret: secret, is2FAEnabled: true });
    });
  });

  describe('validateUserCredentials', () => {
    it('should validate user credentials', async () => {
      const user = { id: 1, nome: 'Gustavo Alves', email: 'gustavo_teste@gmail.com', senhaHash: 'hashedpassword' };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = await service.validateUserCredentials('gustavo_teste@gmail.com', 'password123');

      expect(result).toEqual(user);
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'gustavo_teste@gmail.com' } });
      expect(bcrypt.compareSync).toHaveBeenCalledWith('password123', 'hashedpassword');
    });

    it('should return null for invalid credentials', async () => {
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.validateUserCredentials('gustavo_teste@gmail.com', 'wrongpassword');

      expect(result).toBeNull();
      expect(usersRepository.findOne).toHaveBeenCalledWith({ where: { email: 'gustavo_teste@gmail.com' } });
    });
  });
});
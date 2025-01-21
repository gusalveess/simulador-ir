import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(nome: string, email: string, senha: string): Promise<User> {
    const senhaHash = await bcrypt.hash(senha, 10);
    const user = this.usersRepository.create({ nome, email, senhaHash });
    const result = await this.usersRepository.save(user); 
    return result;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async generate2FA(userId: number) {
    const secret = speakeasy.generateSecret({ length: 20 });

    const otpauthUrl = secret.otpauth_url;
    const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);

    return { secret: secret.base32, qrCodeUrl };
  }

  async updateTwoFactorSecret(userId: number, secret: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    user.twoFactorSecret = secret;
    user.is2FAEnabled = true;
    const result = await this.usersRepository.save(user);
    return result;
  }

  async disableTwoFactorSecret(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    user.twoFactorSecret = null;
    user.is2FAEnabled = false;
    const result = await this.usersRepository.save(user);
    return result;
  }

  async validateUserCredentials(email: string, senha: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && bcrypt.compareSync(senha, user.senhaHash)) {
      return user;
    }
    return null;
  }
  
  async findById(userId: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
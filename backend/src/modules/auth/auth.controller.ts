import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Param, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as speakeasy from 'speakeasy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() body: { nome: string; email: string; senha: string }) {
    const user = await this.usersService.create(body.nome, body.email, body.senha);
    return {
      message: 'Usuário registrado com sucesso!',
      userId: user.id,
    };
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; senha: string; token2fa?: string }) {
    const { email, senha, token2fa } = loginDto;

    const user = await this.usersService.validateUserCredentials(email, senha);
    if (!user) {
      throw new HttpException('Credenciais inválidas.', HttpStatus.UNAUTHORIZED);
    }

    if (user.twoFactorSecret) {
      if (!token2fa) {
        throw new HttpException('Código de 2FA obrigatório.', HttpStatus.UNAUTHORIZED);
      }

      const isValidToken = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token2fa,
      });

      if (!isValidToken) {
        throw new HttpException('Código de 2FA inválido.', HttpStatus.UNAUTHORIZED);
      }
    }

    const token = await this.authService.generateJwt(user);

    return {
      message: 'Login realizado com sucesso!',
      token,
    };
  }

  @Post('enable-2fa/:userId')
  async enableTwoFactorAuth(@Param('userId') userId: number) {
    const user = await this.usersService.findById(userId);
  
    if (!user) {
      throw new HttpException('Usuário não encontrado.', HttpStatus.NOT_FOUND);
    }

    if (user.twoFactorSecret) {
      return {
        message: 'A autenticação de dois fatores já está ativada para este usuário.',
      };
    }
  
    const { secret, qrCodeUrl } = await this.usersService.generate2FA(userId);
    await this.usersService.updateTwoFactorSecret(userId, secret);
  
    return {
      message: 'Autenticação de dois fatores ativada com sucesso.',
      qrCodeUrl,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async getProfile(@Request() req) {
    return {
      message: 'Perfil do usuário autenticado.',
      user: req.user,
    };
  }
}
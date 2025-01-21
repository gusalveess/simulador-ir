import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Param, 
  HttpException, 
  HttpStatus,
  Res
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as speakeasy from 'speakeasy';
import { Response } from 'express';
import { validateEmail } from '../../utils/validators';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { nome: string; email: string; senha: string },
    @Res() res: any
  ) {
    try {
      if (!body.nome || !body.email || !body.senha) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Nome, E-mail e Senha são obrigatórios.',
        });
      }

      if (!validateEmail(body.email)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Email inválido.',
        });
      }

      const existingUser = await this.usersService.findByEmail(body.email);
      if (existingUser) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Email já registrado.',
        });
      }

      const user = await this.usersService.create(body.nome, body.email, body.senha);

      return res.status(HttpStatus.CREATED).json({
        message: 'Usuário registrado com sucesso!',
        userId: user.id,
      });
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao registrar usuário. Tente novamente mais tarde.',
      });
    }
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; senha: string; token2fa?: string }, @Res() res: Response) {
    const { email, senha, token2fa } = loginDto;
    try {
      const user = await this.usersService.validateUserCredentials(email, senha);
      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Credenciais inválidas.',
        });;
      }
  
      if (user.twoFactorSecret) {
        if (!token2fa) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Código de 2FA obrigatório.',
          });
        }
  
        const isValidToken = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: token2fa,
        });
  
        if (!isValidToken) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'Código de 2FA inválido.',
          });
        }
      }
  
      const token = await this.authService.generateJwt(user);
  
      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login realizado com sucesso!',
        token,
        user: user.id
      });
    } catch (err: any) {
      console.log(err)
    }

  }

  @Post('enable-2fa/:userId')
  async enableTwoFactorAuth(@Param('userId') userId: number, @Res() res: Response) {
    const user = await this.usersService.findById(userId);
  
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado.',
      });;
    }

    if (user.twoFactorSecret) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'A autenticação de dois fatores já está ativada para este usuário.',
      });;
    }
  
    const { secret, qrCodeUrl } = await this.usersService.generate2FA(userId);
    await this.usersService.updateTwoFactorSecret(userId, secret);
  
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Autenticação de dois fatores ativada com sucesso.',
      qrCodeUrl,
    });
  }

  @Post('disable-2fa/:userId')
  async disableTwoFactorAuth(@Param('userId') userId: number, @Res() res: Response) {
    const user = await this.usersService.findById(userId);
  
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado.',
      });;
    }
    await this.usersService.disableTwoFactorSecret(userId);
  
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Autenticação de dois fatores desativada com sucesso.',
    });
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
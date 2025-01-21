import { Controller, Get, Param, HttpStatus, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(':userId')
    async listarInformacoes(@Param('userId') userId: number, @Res() res: Response) {
      try {
        const info = await this.usersService.findById(userId);
        
        if (info) {
          const { senhaHash, criadoEm, ...userWithoutInfos } = info;
          
          return res.status(HttpStatus.OK).json({
            info: userWithoutInfos
          });
        } else {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'Usuário não encontrado'
          });
        }
      } catch (error: any) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Erro ao recuperar as informações do usuário'
        });
      }
    }
}

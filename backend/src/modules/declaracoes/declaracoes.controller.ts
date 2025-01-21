import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus,
    Res
  } from '@nestjs/common';
import { DeclaracoesService } from './declaracoes.service';
import { CriarDeclaracaoDto, AtualizarDeclaracaoDto } from '../../shared/declaracao.dto';
import { Response } from 'express';
  
  @Controller('declaracoes')
  export class DeclaracoesController {
    constructor(private readonly declaracoesService: DeclaracoesService) {}
  
    @Post(':userId')
    async criarDeclaracao(@Param('userId') userId: number, @Body() dto: CriarDeclaracaoDto, @Res() res: Response) {
      try {
        const declaracao = await this.declaracoesService.criarDeclaracao(userId, dto.ano, dto.dados);
        return res.status(HttpStatus.CREATED).json({
          message: 'Declaração criada com sucesso!',
          declaracao,
        });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Erro ao criar declaração. Verifique os dados e tente novamente.',
        });
      }
    }
  
    @Get(':userId')
    async listarDeclaracoes(@Param('userId') userId: number, @Res() res: Response) {
      try {
        const declaracoes = await this.declaracoesService.listarDeclaracoesPorUsuario(userId);
        if (!declaracoes.length) {
          return res.status(HttpStatus.OK).json([]);
        }
        return res.status(HttpStatus.OK).json({
          declaracoes
        });
      } catch (error: any) {
        console.log(error)
      }
    }
  
    @Get(':userId/:id')
    async obterDeclaracao(@Param('userId') userId: number, @Param('id') id: number, @Res() res: Response) {
      try {
        const declaracao = await this.declaracoesService.obterDeclaracao(id, userId);
        if (!declaracao) {
          return res.status(HttpStatus.NOT_FOUND).json({
            message: 'Declaração não encontrada para este usuário.',
          });
        }
        return res.status(HttpStatus.OK).json({
          userId,
          declaracao
        });
      } catch (error: any) {
        console.log(error)
      }
    }
  
    @Patch(':userId/:id')
    async atualizarDeclaracao(
      @Param('userId') userId: number,
      @Param('id') id: number,
      @Body() dto: AtualizarDeclaracaoDto,
      @Res() res: Response
    ) {
      try {
        const declaracaoAtualizada = await this.declaracoesService.atualizarDeclaracao(id, userId, dto);
        return res.status(HttpStatus.OK).json({
          message: 'Declaração atualizada com sucesso!',
          declaracaoAtualizada,
        });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({message:'Erro ao atualizar declaração.'});
      }
    }

    @Patch('/send/:userId/:id')
    async enviarDeclaracao(
      @Param('userId') userId: number,
      @Param('id') id: number,
      @Body() dto: AtualizarDeclaracaoDto,
      @Res() res: Response
    ) {
      try {
        const declaracaoAtualizada = await this.declaracoesService.enviarDeclaracao(id, userId, dto);
        return res.status(HttpStatus.OK).json({
          message: 'Declaração enviada com sucesso!',
          declaracaoAtualizada,
        });
      } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({message:'Erro ao atualizar declaração.'});
      }
    }
  
    @Delete(':userId/:id')
    async deletarDeclaracao(@Param('userId') userId: number, @Param('id') id: number, @Res() res: Response) {
      const resultado = await this.declaracoesService.deletarDeclaracao(id, userId);
      if (!resultado) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'Declaração não encontrada.',
        });
      }
      return res.status(HttpStatus.OK).json({ message: 'Declaração removida com sucesso!' });
    }
  }
  
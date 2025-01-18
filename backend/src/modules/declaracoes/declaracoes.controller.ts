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
  } from '@nestjs/common';
import { DeclaracoesService } from './declaracoes.service';
import { CriarDeclaracaoDto, AtualizarDeclaracaoDto } from '../../shared/declaracao.dto';
  
  @Controller('declaracoes')
  export class DeclaracoesController {
    constructor(private readonly declaracoesService: DeclaracoesService) {}
  
    @Post(':userId')
    async criarDeclaracao(@Param('userId') userId: number, @Body() dto: CriarDeclaracaoDto) {
      try {
        const declaracao = await this.declaracoesService.criarDeclaracao(userId, dto.ano, dto.dados);
        return {
          message: 'Declaração criada com sucesso!',
          declaracao,
        };
      } catch (error) {
        throw new HttpException(
          'Erro ao criar declaração. Verifique os dados e tente novamente.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    @Get(':userId')
    async listarDeclaracoes(@Param('userId') userId: number) {
      const declaracoes = await this.declaracoesService.listarDeclaracoesPorUsuario(userId);
      if (!declaracoes.length) {
        throw new HttpException('Nenhuma declaração encontrada para este usuário.', HttpStatus.NOT_FOUND);
      }
      return declaracoes;
    }
  
    @Get(':userId/:id')
    async obterDeclaracao(@Param('userId') userId: number, @Param('id') id: number) {
      const declaracao = await this.declaracoesService.obterDeclaracao(id, userId);
      if (!declaracao) {
        throw new HttpException('Declaração não encontrada.', HttpStatus.NOT_FOUND);
      }
      return declaracao;
    }
  
    @Patch(':userId/:id')
    async atualizarDeclaracao(
      @Param('userId') userId: number,
      @Param('id') id: number,
      @Body() dto: AtualizarDeclaracaoDto,
    ) {
      try {
        const declaracaoAtualizada = await this.declaracoesService.atualizarDeclaracao(id, userId, dto);
        return {
          message: 'Declaração atualizada com sucesso!',
          declaracaoAtualizada,
        };
      } catch (error) {
        throw new HttpException('Erro ao atualizar declaração.', HttpStatus.BAD_REQUEST);
      }
    }
  
    @Delete(':userId/:id')
    async deletarDeclaracao(@Param('userId') userId: number, @Param('id') id: number) {
      const resultado = await this.declaracoesService.deletarDeclaracao(id, userId);
      if (!resultado) {
        throw new HttpException('Declaração não encontrada.', HttpStatus.NOT_FOUND);
      }
      return { message: 'Declaração removida com sucesso!' };
    }
  }
  
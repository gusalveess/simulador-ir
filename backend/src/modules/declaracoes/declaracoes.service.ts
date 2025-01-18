import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Declaracao } from './declaracao.entity';
import { User } from '../users/user.entity';

@Injectable()
export class DeclaracoesService {
  constructor(
    @InjectRepository(Declaracao)
    private readonly declaracaoRepository: Repository<Declaracao>,
  ) {}

  async criarDeclaracao(userId: number, ano: number, dados: object): Promise<Declaracao> {
    const novaDeclaracao = this.declaracaoRepository.create({
      usuario: { id: userId } as User,
      ano,
      dados,
      status: 'não submetida',
    });

    return await this.declaracaoRepository.save(novaDeclaracao);
  }

  async listarDeclaracoesPorUsuario(userId: number): Promise<Declaracao[]> {
    return this.declaracaoRepository.find({
      where: { usuario: { id: userId } },
      order: { ano: 'DESC' },
    });
  }

  async obterDeclaracao(id: number, userId: number): Promise<Declaracao | null> {
    return this.declaracaoRepository.findOne({
      where: { id, usuario: { id: userId } },
    });
  }

  async atualizarDeclaracao(id: number, userId: number, dados: object): Promise<Declaracao> {
    const declaracao = await this.obterDeclaracao(id, userId);
    if (!declaracao) return null;

    declaracao.dados = dados;
    return this.declaracaoRepository.save(declaracao);
  }

  async deletarDeclaracao(id: number, userId: number): Promise<boolean> {
    const result = await this.declaracaoRepository.delete({ id, usuario: { id: userId } });
    return result.affected > 0;
  }
}
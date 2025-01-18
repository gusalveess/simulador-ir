import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Declaracao } from './declaracao.entity';
import { DeclaracoesService } from './declaracoes.service';
import { DeclaracoesController } from './declaracoes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Declaracao])],
  controllers: [DeclaracoesController],
  providers: [DeclaracoesService],
  exports: [DeclaracoesService],
})
export class DeclaracoesModule {}
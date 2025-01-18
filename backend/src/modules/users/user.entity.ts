import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Declaracao } from '../declaracoes/declaracao.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column('text')
  senhaHash: string;

  @CreateDateColumn()
  criadoEm: Date;

  @Column({ nullable: true })
  twoFactorSecret: string;  

  @Column({ default: false })
  is2FAEnabled: boolean;

  @OneToMany(() => Declaracao, (declaracao) => declaracao.usuario)
  declaracoes: Declaracao[];
}
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('declaracoes')
export class Declaracao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.declaracoes, { onDelete: 'CASCADE' })
  usuario: User;

  @Column()
  ano: number;

  @Column({ type: 'jsonb' })
  dados: object;

  @Column({ type: 'varchar', length: 50, default: 'nao submetida' })
  status: string;

  @CreateDateColumn()
  criadoEm: Date;
}
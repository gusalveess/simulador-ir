import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/users/user.entity';
import { Declaracao } from './modules/declaracoes/declaracao.entity';
import { UsersModule } from './modules/users/users.module';
import { DeclaracoesModule } from './modules/declaracoes/declaracoes.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
    TypeOrmModule.forFeature([User, Declaracao]),
    UsersModule,
    DeclaracoesModule,
    AuthModule,
  ],
})
export class AppModule {}
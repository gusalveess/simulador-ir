import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as swaggerUi from 'swagger-ui-express';
import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as cors from 'cors';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const swaggerPath = path.resolve(__dirname, '../src', 'swagger.yaml');

  if (!fs.existsSync(swaggerPath)) {
    console.error(`Arquivo Swagger não encontrado em: ${swaggerPath}`);
    process.exit(1);
  }

  try {
    const swaggerDocument = YAML.load(swaggerPath);
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } catch (error) {
    console.error('Erro ao ler ou processar o arquivo Swagger:', error);
    process.exit(1);
  }

  await app.listen(process.env.PORT ?? 8000);
}

bootstrap();
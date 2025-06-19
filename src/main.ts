import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CONFIG_SERVICE } from './shared/config/config.service';
import { Configuration } from './config/configuration';

async function bootstrap() {
  const { title, description, api_version, port } = CONFIG_SERVICE.get<Configuration['app']>('app')!;
  const app = await NestFactory.create(AppModule, { cors: { allowedHeaders: '*' } });
  const config = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(api_version)
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  await app.listen(port);
}
void bootstrap();

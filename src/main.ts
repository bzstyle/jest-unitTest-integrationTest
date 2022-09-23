import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './config/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  const logger = new Logger(bootstrap.name);
  const port = process.env.SERVER_PORT;

  const options = new DocumentBuilder()
    .setTitle('API prueba')
    .setDescription('Jonatan Fontana')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { showRequesDuration: true, persistAuthorization: true },
    //customCss: cssCustom,
    //customfavIcon: '/icon.png',
  });

  await app.listen(port);
  logger.verbose(`### Server is running on port ${port} ###`);
  logger.verbose(`### Swagger: http://localhost:${port}/api ###`);
  logger.verbose(`@@@@@@@@@@@@   @@@@@@@@@@@   @@@@@@@@@@@@   @@@@@@@@@@@@`);
  logger.verbose(`@@@@@@@@@@@@   @@@@@@@@@@@   @@@@@@@@@@@@   @@@@@@@@@@@@`);
  logger.verbose(`@@@@    @@@@   @@@@          @@@@           @@@@@@@@@@@@`);
  logger.verbose(`@@@@    @@@@   @@@@          @@@@               @@@@`);
  logger.verbose(`@@@@    @@@@   @@@@@@@@@@@   @@@@@@@@@@@@       @@@@`);
  logger.verbose(`@@@@    @@@@   @@@@@@@@@@@   @@@@@@@@@@@@       @@@@`);
  logger.verbose(`@@@@    @@@@   @@@@@@@@@@@   @@@@@@@@@@@@       @@@@`);
  logger.verbose(`@@@@    @@@@   @@@@                  @@@@       @@@@`);
  logger.verbose(`@@@@    @@@@   @@@@                  @@@@       @@@@`);
  logger.verbose(`@@@@    @@@@   @@@@@@@@@@@   @@@@@@@@@@@@       @@@@`);
  logger.verbose(`@@@@    @@@@   @@@@@@@@@@@   @@@@@@@@@@@@       @@@@`);
  logger.verbose(``);
  logger.verbose(`***************** BY JONATAN FONTANA ****************`);
}
bootstrap();

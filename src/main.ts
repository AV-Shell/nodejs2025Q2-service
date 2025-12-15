import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { load as yamlLoad } from 'js-yaml';
import { readFile } from 'fs/promises';
import { resolve as pathResolve } from 'path';
import { SwaggerModule } from '@nestjs/swagger';
import { MyLogger } from './logger/logger.service';

async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  let doc, pathToFile;

  const loggerContainer: { logger: any } = { logger: console };
  process.on('uncaughtException', (e) => {
    loggerContainer.logger?.error(e);
    loggerContainer.logger?.warn(`\n\n Быстро поднятое не считается упавшим!`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    loggerContainer.logger?.error('');
    loggerContainer.logger?.error(
      'Unhandled Rejection at:',
      promise,
      'reason:',
      reason,
    );

    loggerContainer.logger?.warn(`\n\n Быстро поднятое не считается упавшим!`);
  });

  try {
    pathToFile = pathResolve(__dirname, '../doc/api.yaml');
    const file = await readFile(pathToFile, 'utf8');
    doc = yamlLoad(file);
  } catch (e) {
    console.log(`can't load doc`);
    console.log(e);
  }

  const app = await NestFactory.create(AppModule, { cors: true });
  if (doc && pathToFile) {
    SwaggerModule.setup('doc', app, doc);
  }

  const logger = app.get(MyLogger);
  loggerContainer.logger = logger;
  app.useLogger(logger);

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT, () => {
    logger.log(`Swagger started from file ${pathToFile} on \\doc endpoint`);
    logger.log(`Server started on port = ${PORT}`);
    logger.error('testError');
    logger.warn('testWarn');
    logger.log('testlog');
    logger.verbose('testverbose');
    logger.debug('testdebug');
  });

  // setTimeout(() => {
  //   Promise.reject('Test unhandledRejection');
  // }, 5000);
  // setTimeout(() => {
  //   throw new Error('Test uncaughtException');
  // }, 4000);
}

bootstrap();

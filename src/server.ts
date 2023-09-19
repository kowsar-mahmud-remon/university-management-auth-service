import mongoose from 'mongoose';
import app from './app';
import config from './config';
import subscribeToEvents from './app/events';
import { logger, errorlogger } from './shared/logger';
import { Server } from 'http';
import { RedisClient } from './shared/redis';

process.on('uncaughtException', error => {
  errorlogger.error(error);
  process.exit(1);
});

let server: Server;

async function bootstrap() {
  try {
    await RedisClient.connect().then(() => {
      subscribeToEvents();
    });
    await mongoose.connect(config.database_url as string);
    logger.info(`Data base is connected`);

    server = app.listen(config.port, () => {
      logger.info(`Application app listening on port ${config.port}`);
    });
  } catch (error) {
    errorlogger.error('Failed to connect database', error);
  }

  process.on('unhandledRejection', error => {
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

process.on('SIGTERM', () => {
  logger.info('SIGTERM is receiving');
  if (server) {
    server.close();
  }
});

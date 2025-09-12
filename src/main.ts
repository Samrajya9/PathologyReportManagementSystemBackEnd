import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
const os = require('os');
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const frontendUrl = process.env.FRONTEND_URL!;
  const app_Port = process.env.APP_PORT!;
  const app = await NestFactory.create(AppModule, {
    cors: { origin: frontendUrl, credentials: true },
  });
  app.use(cookieParser()); // 👈 enables req.cookies

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(app_Port, '0.0.0.0', () =>
    console.log(`${getServerIp()}:3000`),
  ); // 👈 bind to all interfaces (localhost + LAN)
}
bootstrap();

function getServerIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // تنظیمات اضافی مانند Cors یا Middleware در اینجا اضافه شود
  await app.listen(5000);
  console.log('ُServer Running on port 5000 ');
}
bootstrap();

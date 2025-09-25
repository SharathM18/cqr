import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseTransformInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Important for cookies
  });

  // Enable helmet with default security headers
  //   app.use(helmet());

  // Global interceptor for success responses
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Global exception filter for errors
  app.useGlobalFilters(new GlobalExceptionFilter());

  // enable cookie parsing
  app.use(cookieParser());

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Rate limiting
  //   app.use('/api/v1/auth/login', loginLimiter);

  const port = config.get<number>('port', 3001);
  await app.listen(port);

  console.log(
    `=== Application running on: http://localhost:${port}/api/v1 ===`,
  );
}

bootstrap();

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
      load: [configuration], // loads custom config
      validationSchema, // validates env vars
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

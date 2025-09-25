import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtConfigModule } from 'src/shared/jwt/jwt.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [PrismaModule, JwtConfigModule, PassportModule, UsersModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtRefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

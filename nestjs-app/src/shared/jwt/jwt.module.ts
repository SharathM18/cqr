import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt.secrete'),
        signOptions: {
          expiresIn: config.get<string>('jwt.expiresIn'), // default expiry (override in code if needed)
        },
      }),
    }),
  ],
  exports: [JwtModule],
})
export class JwtConfigModule {}

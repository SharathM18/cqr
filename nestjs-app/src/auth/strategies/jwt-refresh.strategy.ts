import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => req.cookies?.refreshToken, // get from cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('Unauthorized access');

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.refreshToken)
      throw new UnauthorizedException('Unauthorized access');

    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new UnauthorizedException('Unauthorized access');

    const { password, ...result } = user;
    return result; // attaches user to req.user
  }
}

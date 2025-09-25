// JwtStrategy — verifies access tokens on protected routes.
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // super methods internally verify the access token
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extracts the token from the Authorization header as a Bearer token.
      ignoreExpiration: false, // Reject expired tokens
      secretOrKey: config.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any) {
    // token payload
    return { userId: payload.sub, email: payload.email };
  }
}

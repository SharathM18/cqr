// Passport LocalStrategy — verifies username/password (used only for the login endpoint).

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' }); // by default, passport expects "username". We tell it to use "email".
  }

  async validate(email: string, password: string) {
    const user = await this.authService.validateUser({ email, password });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user; // attaches user object to request
  }
}

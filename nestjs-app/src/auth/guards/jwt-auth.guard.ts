import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// 'jwt' is the name of the strategy.
// Passport strategies are registered under a string key, usually the class name lowercase.
// In your case, JwtStrategy extends PassportStrategy(Strategy)

// Flow
// Client sends request with Authorization: Bearer <token>.
// @UseGuards(JwtAuthGuard)
// JwtAuthGuard triggers because of @UseGuards().
// AuthGuard('jwt') tells Passport → “Use the strategy named 'jwt'.”
// JwtStrategy verifies the token and returns payload from validate().
// Payload becomes req.user.

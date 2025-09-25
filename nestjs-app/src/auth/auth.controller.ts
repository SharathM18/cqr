import {
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // secure: true, // use true in production (HTTPS only)
      sameSite: 'strict', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/', // restrict cookie scope
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(dto);

    // Set refresh token as HttpOnly cookie
    this.setRefreshTokenCookie(res, user.refreshToken);

    const { refreshToken, ...userWithoutToken } = user;

    return {
      data: userWithoutToken,
      message: 'User registration successfully!',
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(req.user);

    this.setRefreshTokenCookie(res, user.refreshToken);

    const { refreshToken, ...userWithoutToken } = user;

    return {
      data: userWithoutToken,
      message: 'User login successfully!',
    };
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refreshTokens(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.refreshTokens(req.user);

    this.setRefreshTokenCookie(res, user.refreshToken);

    const { refreshToken, ...userWithoutToken } = user;

    return {
      data: userWithoutToken,
      message: 'Tokens refreshed successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.userId;
    await this.authService.logout(userId);
    res.clearCookie('refreshToken', { path: '/' });
    return { message: 'Logged out successfully' };
  }
}

// @Res() res: Response -> gives you manual control of the HTTP response (cookies, headers, raw data).

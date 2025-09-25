import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from '../shared/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
    private userService: UsersService,
  ) {}

  private signAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.secret'),
      expiresIn: this.config.get<string>('jwt.expiresIn'),
    });
  }

  private signRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('jwt.refreshSecret'),
      expiresIn: this.config.get<string>('jwt.refreshExpiresIn'),
    });
  }

  async register(dto: RegisterDto) {
    try {
      const rounds = this.config.get<number>('bcrypt.rounds');
      const hashedPassword = await bcrypt.hash(dto.password, rounds);

      const user = await this.userService.createUser({
        email: dto.email,
        password: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
      });

      const payload = { sub: user.id, email: user.email };
      const accessToken = this.signAccessToken(payload);
      const refreshToken = this.signRefreshToken(payload);

      const hashedRefresh = await bcrypt.hash(refreshToken, rounds);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefresh },
      });

      return {
        user: { id: user.id, email: user.email },
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async validateUser(userLoginPayload) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: userLoginPayload.email },
      });
      if (!user) return null;

      const isPasswordValid = await bcrypt.compare(
        userLoginPayload.password,
        user.password,
      );
      if (!isPasswordValid) return null;

      const { password, refreshToken, ...result } = user;
      return result;
    } catch (err) {
      throw new InternalServerErrorException('User validation failed');
    }
  }

  async login(user: any) {
    try {
      const rounds = this.config.get<number>('bcrypt.rounds');
      const payload = { sub: user.id, email: user.email };

      const accessToken = this.signAccessToken(payload);
      const refreshToken = this.signRefreshToken(payload);

      const hashedRefresh = await bcrypt.hash(refreshToken, rounds);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefresh },
      });

      return {
        user: { id: user.id, email: user.email },
        accessToken,
        refreshToken,
      };
    } catch (err) {
      throw new InternalServerErrorException('Login failed');
    }
  }

  async refreshTokens(user: any) {
    try {
      const rounds = this.config.get<number>('bcrypt.rounds');
      const payload = { sub: user.id, email: user.email };

      const newAccessToken = this.signAccessToken(payload);
      const newRefreshToken = this.signRefreshToken(payload);

      const hashedRefresh = await bcrypt.hash(newRefreshToken, rounds);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { refreshToken: hashedRefresh },
      });

      return {
        user: { id: user.id, email: user.email },
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Unauthorized access');
    }
  }

  async logout(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { refreshToken: null },
      });

      return;
    } catch {
      throw new InternalServerErrorException('Logout failed');
    }
  }
}

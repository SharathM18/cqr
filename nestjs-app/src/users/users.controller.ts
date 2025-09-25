import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUser() {
    return { user: 'all user' };
  }
}

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(user: any) {
    try {
      const result = await this.prisma.user.create({ data: user });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('User creation failed');
    }
  }
}

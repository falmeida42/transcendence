import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger('UserService');

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserByLogin(userLogin: string): Promise<UserDto | null> {
    return this.prisma.user.findUnique({ where: { login: userLogin } });
  }

  async create(user: UserDto) {
    return this.prisma.user.create({
      data: user,
    });
  }

  async set2FASecret(id: string, secret: string) {
    return await this.prisma.user.update({
      where: { id: id },
      data: { twoFactorAuthSecret: secret },
    });
  }

  async set2FAOn(id: string) {
    return this.prisma.user.update({
      where: { id: id },
      data: { twoFactorAuthEnabled: true },
    });
  }

  async set2FAOff(id: string) {
    return this.prisma.user.update({
      where: { id: id },
      data: { twoFactorAuthEnabled: false },
    });
  }

  async is2FAEnabled(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }
    return user.twoFactorAuthEnabled;
  }
}

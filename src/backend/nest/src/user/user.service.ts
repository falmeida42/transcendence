import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = new Logger('UserService');

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(userId: string): Promise<UserDto | null> {
    try {
      return await this.prisma.user.findUnique({ where: { id: userId } });
    } catch (error) {
      this.logger.error(error);
      throw new Error(`Failed to return user with id ${userId}`);
    }
  }

  async getUserByLogin(userLogin: string): Promise<UserDto | null> {
    return await this.prisma.user.findUnique({ where: { login: userLogin } });
  }

  async updateUserById(userId: string, userData: Partial<UserDto>): Promise<UserDto | null> {
    return await this.prisma.user.update({
      where: { id: userId },
      data: userData,
    });
  }

  async create(user: UserDto) {
    return await this.prisma.user.create({
      data: user,
    });
  }

  async set2FASecret(id: string, secret: string) {
    try {
      return await this.prisma.user.update({
        where: { id: id },
        data: { twoFactorAuthSecret: secret },
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async set2FAOn(id: string) {
    return await this.prisma.user.update({
      where: { id: id },
      data: { twoFactorAuthEnabled: true },
    });
  }

  async set2FAOff(id: string) {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        twoFactorAuthEnabled: false
      },
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

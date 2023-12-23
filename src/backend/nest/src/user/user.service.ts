import { Injectable, Logger } from '@nestjs/common';
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

  async setTwoFactorAuthSecret(secret: string, id: string) {
    const user = await this.getUserById(id);
    if (user) {
      const updated = await this.prisma.user.update({
        where: { id: id },
        data: {
          twoFactorAuthSecret: secret,
          twoFactorAuthEnabled: true,
        },
      });
      this.logger.log(
        'Setting two factor authentication for user ',
        user.username,
      );
      return updated;
    }

    this.logger.error('User does not exist');

    return null;
  }

  async setTwoFactorAuthOn(login: string) {
    const user = await this.getUserByLogin(login);
    if (user.twoFactorAuthEnabled == false) {
      return this.prisma.user.update({
        where: { login: login },
        data: { twoFactorAuthEnabled: true },
      });
    }

    this.logger.error('User does not exist');

    return null;
  }

  async setTwoFactorAuthOff(login: string) {
    const user = await this.getUserByLogin(login);
    if (user.twoFactorAuthEnabled == true) {
      return this.prisma.user.update({
        where: { login: login },
        data: { twoFactorAuthEnabled: false },
      });
    }

    this.logger.error('User does not exist');

    return null;
  }

  async isTwoFactorAuthEnabled(login: string): Promise<boolean | null> {
    const user = await this.getUserByLogin(login);
    if (user) {
      return user.twoFactorAuthEnabled;
    }
    return null;
  }
}

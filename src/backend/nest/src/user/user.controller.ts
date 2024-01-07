import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetMe } from 'src/decorators';
import { JwtAuthGuard } from '../auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { TwoFAGuard } from 'src/auth/guard/2FA.guard';
import { UserService } from './user.service';

// @UseGuards(FTGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  private readonly logger = new Logger('UserController');

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers() {
    try {
      return await this.userService.getUsers();
    } catch (error) {
      this.logger.error(error);
      return { error: error, message: 'Unable to get users' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetMe() user: User) {
    // this.logger.debug(JSON.stringify(user));
    return user;
  }

  @UseGuards(TwoFAGuard)
  @Get('auth')
  async getAuth(@GetMe() user: User) {
    return (await this.findById(String(user.id))).twoFactorAuthEnabled;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':login')
  async delete(@Param('login') login: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      return 'User not found';
    }

    return this.prisma.user.delete({ where: { login } });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username')
  async changeUsername(
    @GetMe() user: User,
    @Param('username') username: string,
  ) {
    try {
      this.prisma.user.update({
        where: { id: user.id },
        data: { username: username },
      });
    } catch (error) {
      this.logger.error(error);
      throw new Error(error.message);
    }
  }
}

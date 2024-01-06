import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Logger,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetMe } from 'src/decorators';
import { User } from '@prisma/client';
import { TwoFAGuard } from 'src/auth/guard/2FA.guard';

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
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetMe() user: User) {
    const logInfo = {
      user: user, // Log only the user property
    };
    this.logger.debug(JSON.stringify(logInfo));
    return this.findById(String(user.id));
  }

  @UseGuards(TwoFAGuard)
  @Get('auth')
  async getAuth(@GetMe() user: User) {
    // const logInfo = {
    //   // user: user, // Log only the user property
    //   user: {id: user.id, twoFactorAuthEnabled: user.twoFactorAuthEnabled},

    // };
    // this.logger.debug(JSON.stringify(logInfo));
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
    @GetMe() userInfo: User,
    @Param('username') username: string,
  ) {
    try {
      const user = this.prisma.user.update({
        where: { id: userInfo.id },
        data: { username: username },
      });

      if (!user) {
        throw new Error('Failed to update username');
      }
    } catch (error) {
      return { error: error.message };
    }
  }
}

import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { TwoFAGuard } from 'src/auth/guard/2FA.guard';
import { GetMe } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guard';
import { UserService } from './user.service';

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

  @UseGuards(JwtAuthGuard)
  @Get('/matches/:id')
  async getMatches(@Param('id') id: string) {
    try {
      this.logger.debug(id);
      let matches = [];
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          wins: true,
          losses: true,
        },
      });
      // const wins = await this.prisma.match.findMany({
      //   where: {
      //     userwinId: id,
      //   },
      // });
      // const losses = await this.prisma.match.findMany({
      //   where: {
      //     userlosId: id,
      //   },
      // });
      // matches = [...wins, ...losses];
      // this.logger.debug();
      matches = [...user.wins, ...user.losses].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
      );
      if (!matches) throw new Error('teste');
      // const matches = user.
      return matches;
    } catch (e) {
      this.logger.error(e.message);
    }
  }
}

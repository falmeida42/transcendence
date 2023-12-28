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

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) {}

  private readonly logger = new Logger('UserController');

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('me')
  async getMe(@GetMe() user: User) {
    const logInfo = {
      user: user, // Log only the user property
    };
    this.logger.debug(JSON.stringify(logInfo));
    return this.findById(String(user.id));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete(':login')
  async delete(@Param('login') login: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      return 'User not found';
    }

    return this.prisma.user.delete({ where: { login } });
  }

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

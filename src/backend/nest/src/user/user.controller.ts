import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetMe } from 'src/decorators';
import { JwtAuthGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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

  @Delete('/login')
  async delete(@Param('login') login: string) {
    if (!login) {
      return 'No value inserted';
    }
    return this.userService.delete(login);
  }
}

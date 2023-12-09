import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Body,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  private readonly logger = new Logger('UserController');

  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:id')
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

  @Get('me')
  async getMe(@Body() req: any) {
    this.logger.log(req);
  }
}

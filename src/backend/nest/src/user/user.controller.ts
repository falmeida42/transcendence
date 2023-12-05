import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthenticationGuard} from '../auth/guard';


@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  @UseGuards(AuthenticationGuard)
  async findById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Delete('/login')
  @UseGuards(AuthenticationGuard)
  async delete(@Param('login') login: string) {
    if (!login) {
      return 'No value inserted';
    }
    return this.userService.delete(login);
  }
}

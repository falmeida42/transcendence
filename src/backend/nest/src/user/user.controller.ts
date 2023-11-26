import { Controller, Get, Param, Post, Body, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get('/:id')
  async findById(@Param('id') id: number) {
    return this.usersService.getUserById(id);
  }

  @Post()
//   @UseGuards()
  async create(@Body() user: UserDto) {
    if (!user) {
      return 'No value inserted';
    }
    console.log(user);
    return this.usersService.create(user);
  }

  @Delete('/:login')
//   @UseGuards()
  async delete(@Param('login') login: string) {
    if (!login) {
      return 'No value inserted';
    }
    return this.usersService.delete(login);
  }
}

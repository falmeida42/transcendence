import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  UseGuards,
  Logger,
  Post,
  Body
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

  @Get('me')
  async getMe(@Req() req: any) {
    const logInfo = {
      user: req.user, // Log only the user property
    };
    this.logger.debug(JSON.stringify(logInfo));
    return this.findById(String(req.user.id));
  }

  @Get('find/:id')
  async findById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }


  @Get('find/:login')
  async findByLogin(@Param('login') login: string) {   
      return this.userService.getUserByLogin(login);
  }

  @Get('all')
  async getAll() {   
      return this.userService.getAll();
  }

  @Get('friends')
  async getFriends(@Req() req: any) {   
      return this.userService.getFriends(String(req.user.id));
  }
  

  @Delete('/login')
  async delete(@Param('login') login: string) {
    if (!login) {
      return 'No value inserted';
    }
    return this.userService.delete(login);
  }

  // @Post('add-friend')
  // async addFriend(@Req() req: any, @Body() body: any) {

  //   if (!body.friendlogin)
  //   return this.userService.addFriend()
  // }
}

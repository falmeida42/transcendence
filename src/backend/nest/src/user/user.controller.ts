import {
  Controller,
  Get,
  Param,
  Delete,
  Req,
  UseGuards,
  Logger,
  Post
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
    return this.userService.getUserById(String(req.user.id));
  }

  @Get('find/:id')
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

  @Get('friends')
  async getFriends(@Req() req: any) {
    
    console.log("backend getting friends")
    
    const frineds = this.userService.getFriends(String(req.user.id));
    
    console.log("friends receeeeived ", frineds)
    return frineds
  }

  @Post(':userId/add-friend/:friendName')
  async addFriend(
    @Param('userId') userId: string,
    @Param('friendName') friendName: string,
  ): Promise<string> {
    try {
      const user = await this.userService.getUserById(userId)

      if (!user) {
        return 'User not found';
      }
      const friend = await this.userService.getUserById(friendName)

      await this.userService.insertFriend(userId, friend.id)

      return 'Friend added'
    } catch (error) {
      console.error(error);
      return 'Error to add a friend'   
    }
  }
}
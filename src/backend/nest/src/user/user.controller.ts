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

  @Get('findlogin/:login')
  async findByLogin(@Param('login') login: string) {

    return this.userService.getUserByLogin(login);
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
    
    const friends = this.userService.getFriends(String(req.user.id));
    
    console.log("friends receeeeived ", friends)
    return friends
  }

  @Get('chatRooms')
  async getChatRooms(@Req() req: any) {
    
    console.log("backend getting ChatRooms")
    
    const ChatRooms = this.userService.getChatRooms(String(req.user.id));
    
    console.log("friends receeeeived ", ChatRooms)
    return ChatRooms
  }

  @Get('chatHistory/:id')
  async getChatHistory(@Req() req: any, @Param('id') id: string) {
    
    const chatHistory = this.userService.getChatHistory(req.user.id, id);
    
    return chatHistory
  }

  @Post('add-friend/:friendName')
  async addFriend(
    @Req() req: any,
    @Param('friendName') friendName: string,
  ): Promise<string> {
    try {
      const user = await this.userService.getUserById(String(req.user.id))
            
      if (!user) {
        return 'User not found';
      }
      const friend = await this.userService.getUserByLogin(friendName)

      await this.userService.insertFriend(String(req.user.id), friend.id)

      return 'Friend added'
    } catch (error) {
      console.error(error);
      return 'Error to add a friend'   
    }
  }
}
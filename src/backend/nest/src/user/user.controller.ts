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

  @Get('chatRoom/:id')
  async getChatRoomById(@Req() req: any, @Param('id') id: string) {
    
    console.log("backend getting ChatRoom with id ", id)
    
    const ChatRoom = this.userService.getChatRoomById(id);
    
    console.log("chat room receeeeived ", ChatRoom)
    return ChatRoom
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

  @Post('add-room')
  async addRoom(
    @Req() req: any,
    @Body() body: any,
  ) {
      if (body.roomdata) {
        body.roomdata.type = body.roomdata.type.toUpperCase()
        console.log("Add room")
        console.log(JSON.stringify(body))
        await this.userService.createRoom(String(req.user.id), body.roomdata)
      }
  }

  @Post('update-room-privacy/:roomId')
  async updateRoomPrivacy(
    @Req() req: any,
    @Body() body: any,
    @Param('roomId') roomId: string,
  ) {
      if (body) {
        console.log("Updated room privacy")
        console.log(JSON.stringify(body))
        await this.userService.updateChatRoomPrivacy(roomId, body.type, body.password)
      }
  }

  @Get('joinable-rooms')
  async joinableRooms(@Req() req: any) {
    return this.userService.getJoinableRooms(String(req.user.id))
  }


  @Post('join-room')
  async joinRoom(
  @Req() req: any,
  @Body() body: any
){
    return this.userService.joinRoom(body.username, body.roomId, body.password, body.roomType)
};
  // In your resolver or service file

//...

@Post('leave-room')
async leaveRoom(
  @Req() req: any,
  @Body() body: any
){
    return this.userService.leaveRoom(body.username, body.roomId)
};

//...

}
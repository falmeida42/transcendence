import {
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Body,
  Param,
  UseGuards,
  Req
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetMe } from 'src/decorators';
import { JwtAuthGuard } from '../auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { TwoFAGuard } from 'src/auth/guard/2FA.guard';
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

  @UseGuards(JwtAuthGuard)
  @Get('findlogin/:login')
  async findByLogin(@Param('login') login: string) {

    return this.userService.getUserByLogin(login);
  }

  
  @UseGuards(TwoFAGuard)
  @Get('auth')
  async getAuth(@GetMe() user: User) {
    return (await this.findById(String(user.id))).twoFactorAuthEnabled;
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async findById(@Param('id') id: string) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:login')
  async delete(@Param('login') login: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      return 'User not found';
    }

    return this.prisma.user.delete({ where: { login } });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-user/:username')
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
  @Get('friends')
  async getFriends(@Req() req: any) {
    
    console.log("backend getting friends")
    
    const friends = this.userService.getFriends(String(req.user.id));
    
    console.log("friends receeeeived ", friends)
    return friends
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatRooms')
  async getChatRooms(@Req() req: any) {
    
    console.log("backend getting ChatRooms")
    
    const ChatRooms = this.userService.getChatRooms(String(req.user.id));
    
    console.log("friends receeeeived ", ChatRooms)
    return ChatRooms
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatRoom/:id')
  async getChatRoomById(@Req() req: any, @Param('id') id: string) {
    
    console.log("backend getting ChatRoom with id ", id)
    
    const ChatRoom = this.userService.getChatRoomById(id);
    
    console.log("chat room receeeeived ", ChatRoom)
    return ChatRoom
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatHistory/:id')
  async getChatHistory(@Req() req: any, @Param('id') id: string) {
    
    const chatHistory = this.userService.getChatHistory(req.user.id, id);
    
    return chatHistory
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Post('add-room')
  async addRoom(
    @Req() req: any,
    @Body() body: any,
  ): Promise<any> {
    console.log("adding room", JSON.stringify(body))
      if (body.roomdata) {
        body.roomdata.type = body.roomdata.type.toUpperCase()
        console.log("Add room")
        console.log(JSON.stringify(body))
        await this.userService.createRoom(String(req.user.id), body.roomdata)
      }
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Get('joinable-rooms')
  async joinableRooms(@GetMe('id') id: string) {
    // this.logger.debug("joinable-rooms req", JSON.stringify(req.user))
    return await this.userService.getJoinableRooms(id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('join-room')
  async joinRoom(
  @Req() req: any,
  @Body() body: any
){
    return this.userService.joinRoom(body.username, body.roomId, body.password, body.roomType)
};

@UseGuards(JwtAuthGuard)
@Post('leave-room')
async leaveRoom(
  @Req() req: any,
  @Body() body: any
){
    return this.userService.leaveRoom(body.username, body.roomId)
};

}
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
  Res,
  Query
} from '@nestjs/common';
import { User } from '@prisma/client';
import { TwoFAGuard } from 'src/auth/guard/2FA.guard';
import { GetMe } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guard';
import * as bcrypt from '../utils';
import { UserService } from './user.service';
import { Response } from 'express';

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
      return { message: error, code: HttpStatus.BAD_REQUEST };
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
      return { message: error, code: HttpStatus.BAD_REQUEST };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends')
  async getFriends(@GetMe('id') id: string) {
    const friends = this.userService.getFriends(id);

    return friends;
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatRooms')
  async getChatRooms(@GetMe('id') id: string) {
    const ChatRooms = this.userService.getChatRooms(id);

    return ChatRooms;
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatRoom/:id')
  async getChatRoomById(@Param('id') id: string) {
    return this.userService.getChatRoomById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatHistory/:id')
  async getChatHistory(@GetMe('id') userId: string, @Param('id') id: string) {
    return this.userService.getChatHistory(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-friend/:friendName')
  async addFriend(
    @GetMe('id') id: string,
    @Param('friendName') friendName: string,
  ): Promise<string> {
    try {
      const user = this.userService.getUserById(id);

      if (!user) {
        return 'User not found';
      }
      const friend = await this.userService.getUserByLogin(friendName);

      if (!friend) {
        return 'Friend not found';
      }

      this.userService.insertFriend(id, friend.id);

      return 'Friend added';
    } catch (error) {
      this.logger.error(error);
      return 'Error to add a friend';
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-room')
  async addRoom(
    @GetMe('id') id: string,
    @Body('roomdata') roomdata: any,
  ): Promise<any> {
    if (roomdata) {
      roomdata.type = roomdata.type.toUpperCase();
      await this.userService.createRoom(id, roomdata);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-room-privacy/:roomId')
  async updateRoomPrivacy(
    @Body('type') type: any,
    @Body('password') password: any,
    @Param('roomId') roomId: string,
  ) {
    if (type && password) {
      const hashedPassword = await bcrypt.hashPassword(password);
      await this.userService.updateChatRoomPrivacy(
        roomId,
        type,
        hashedPassword,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('joinable-rooms')
  async joinableRooms(@GetMe('id') id: string) {
    try {
      return await this.userService.getJoinableRooms(id);
    } catch (error) {
      this.logger.error(error);
      return { error: error, message: 'Could not get joinable rooms' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('join-room')
  async joinRoom(
    @Body('username') username: string,
    @Body('roomId') roomId: string,
    @Body('password') password: string,
    @Body('roomType') roomType: string,
  ) {
    return this.userService.joinRoom(username, roomId, password, roomType);
  }

  @UseGuards(JwtAuthGuard)
  @Post('leave-room')
  async leaveRoom(
    @GetMe('username') username: string,
    @Body('roomId') roomId: string,
  ) {
    return this.userService.leaveRoom(username, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-admin')
  async addAdmin(
    @GetMe('login') login: string,
    @Body('chatId') chatId: string,
    @Body('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      this.logger.debug('adding room', login);
      await this.userService.addAdminToChat(login, chatId, userId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User added as admin successfully' });
    } catch (error) {
      this.logger.debug('Error received from add admin', error);
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: error.message })
        .send();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('channelParticipants/:chatId')
  async getChannelParticipants(
    @Param('chatId') chatId: string,
    @Res() res: Response,
  ) {
    try {
      // this.logger.debug('getting channel participants');
      const result = await this.userService.getChannelParticipants(chatId);
      return res.status(HttpStatus.OK).json({ result: result });
    } catch (error) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: error.message })
        .send();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('can-kick')
  async canKick(
    @GetMe() user: User,
    @Query('roomId') roomId: string,
    @Res() res: Response,
  ) {
    const room = await this.userService.kickableUsers(user, roomId);
    if (!room) {
      return;
    }
    return res.status(HttpStatus.OK).json({ result: room });
  }

  @UseGuards(JwtAuthGuard)
  @Post('kick')
  async kickUser(
    @GetMe() user: User,
    @Body('roomId') roomId: string,
    @Body('participantId') kickedId: string,
    @Res() res: Response,
  ) {
    this.logger.debug('User: ', user);
    this.logger.debug('Room: ', roomId);
    this.logger.debug('Kicking: ', kickedId);
    try {
      if (await this.userService.isOwner(user.id, roomId)) {
        await this.userService.kickUser(kickedId, roomId);
        return res.status(HttpStatus.OK).send();
      } else if (await this.userService.isAdmin(user.id, roomId)) {
        if (
          (await this.userService.isOwner(kickedId, roomId)) ||
          (await this.userService.isAdmin(kickedId, roomId))
        ) {
          return res.status(HttpStatus.FORBIDDEN).send();
        }
        await this.userService.kickUser(kickedId, roomId);
        return res.status(HttpStatus.OK).send();
      } else {
        return res.status(HttpStatus.FORBIDDEN).send();
      }
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).json({ message: error.message }).send();
    }
  }

}

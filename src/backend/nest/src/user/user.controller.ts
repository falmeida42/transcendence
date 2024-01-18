import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { TwoFAGuard } from 'src/auth/guard/2FA.guard';
import { GetMe } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guard';
import * as bcrypt from '../utils';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
  ) { }

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
  @Post('me')
  async updateMe(@GetMe() user: User, @Body() userData: any) {
    const updatedUser = await this.userService.updateUserById(
      String(user.id),
      userData,
    );
    return updatedUser;
  }

  @UseGuards(TwoFAGuard)
  @Get('auth')
  async getAuth(@GetMe() user: User) {
    return (await this.findById(String(user.id))).twoFactorAuthEnabled;
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async findById(@Param('id') id: string) {
    const User = await this.userService.getUserById(id);
    return User;
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/login/:login')
  async findByLogin(@Param('login') login: string) {
    const User = await this.userService.getUserByLogin(login);
    if (!User) {
      throw new NotFoundException("User not found.")
    }
    return User;
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAll() {
    return await this.userService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('friends')
  async getFriends(@GetMe('id') id: string) {
    return await this.userService.getFriends(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('not-friends')
  async getNotFriends(@GetMe('id') id: string) {
    return await this.userService.getNotFriends(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('blockable-users')
  async getBlockableUsers(@GetMe('id') id: string) {
    return await this.userService.getBlockableUsers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-friend-request')
  async addFriendRequest(
    @Req() req: Request,
    @Body('requesterId') requesterId: string,
    @Body('requesteeId') requesteeId: string,
    @Res() res: Response,
  ) {
    if (await this.userService.isBlocked(requesterId, requesteeId)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'This user blocked you' }).send();
    }
    return await this.userService.addFriendRequest(
      requesterId,
      requesteeId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('handle-friend-request')
  async handleFriendRequest(@GetMe('id') id: string, @Body() body: any) {
    try {
      const result = await this.userService.handleFriendRequest(
        body.requesterId,
        id,
        body.requestId,
        body.type,
      );
      return { statusCode: HttpStatus.CREATED, ...result };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error accepting friend request',
        error,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('block-user')
  async blockUser(@GetMe('id') id: string, @Body() body: any) {
    // this.logger.debug("ACCEPT FETCH BODY:");
    try {
      const result = await this.userService.blockUser(id, body.blockedId);
      return { statusCode: HttpStatus.CREATED, ...result };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error accepting friend request',
        error,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('friend-requests')
  async getFriendRequests(@GetMe('id') id: string) {
    return await this.userService.getFriendRequests(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('matches/:id')
  async getMatches(@Param('id') id: string) {
    try {
      let matches = [];
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          wins: {
            include: {
              winner: true,
              loser: true,
            },
          },
          losses: {
            include: {
              winner: true,
              loser: true,
            },
          },
        },
      });
      matches = [...user.wins, ...user.losses].sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );

      if (!matches) throw new Error('teste');
      return matches;
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('matches-wins/:id')
  async getWins(@Param('id') id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          wins: true,
          losses: true,
        },
      });

      const winsCount = user.wins.length;
      const lossesCount = user.losses.length;

      return { winsCount, lossesCount };
    } catch (e) {
      this.logger.error(e.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-user/:username')
  async changeUsername(
    @GetMe() user: User,
    @Param('username') username: string,
  ) {
    try {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { username: username },
      });
    } catch (error) {
      this.logger.error(error);
      return { message: error, code: HttpStatus.BAD_REQUEST };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatRooms')
  async getChatRooms(@GetMe('id') id: string) {
    this.logger.debug("chat rooms get me id: ", id);
    const ChatRooms = await this.userService.getChatRooms(id);

    return ChatRooms;
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatRoom/:id')
  async getChatRoomById(@Param('id') id: string) {
    return await this.userService.getChatRoomById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatHistory/:id')
  async getChatHistory(@GetMe('id') userId: string, @Param('id') id: string) {
    return await this.userService.getChatHistory(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-friend/:friendName')
  async addFriend(
    @GetMe('id') id: string,
    @Param('friendName') friendName: string,
  ): Promise<string> {
    try {
      const user = await this.userService.getUserById(id);

      if (!user) {
        return 'User not found';
      }
      const friend = await this.userService.getUserByLogin(friendName);

      if (!friend) {
        return 'Friend not found';
      }

      this.userService.insertFriend(friend.id, id);
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
    @Res() res: Response,
    @Req() req: Request,
  ) {
    console.log('received token:', req.headers['authorization']);

    if (await this.userService.isBanned(username, roomId)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    const joinResponse = await this.userService.joinInRoom(
      username,
      roomId,
      password,
      roomType,
    );

    if (joinResponse.success) {
      return res.status(HttpStatus.OK).json({
        success: true,
        message: joinResponse.message,
      });
    } else {
      return res.status(HttpStatus.OK).json({
        success: false,
        message: joinResponse.message,
      });
    }
  }


  @UseGuards(JwtAuthGuard)
  @Post('leave-room')
  async leaveRoom(
    @GetMe('username') username: string,
    @Body('roomId') roomId: string,
  ) {
    return await this.userService.leaveRoom(username, roomId);
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
    try {
      const room = await this.userService.kickableUsers(user, roomId);
      if (!room) {
        return;
      }
      return res.status(HttpStatus.OK).json(room);
    } catch (error) {
      this.logger.error(error);
      return res.json({ error: error }).send();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('kick')
  async kickUser(
    @GetMe() user: User,
    @Body('roomId') roomId: string,
    @Body('participantId') kickedId: string,
    @Res() res: Response,
  ) {
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

  // SAME CODE AS ABOVE
  @UseGuards(JwtAuthGuard)
  @Post('ban-user')
  async banUser(
    @GetMe() user: User,
    @Body('roomId') roomId: string,
    @Body('participantId') participantId: string,
    @Res() res: Response,
  ) {
    try {
      if (await this.userService.isOwner(user.id, roomId)) {
        await this.userService.banUser(participantId, roomId);
        return res.status(HttpStatus.OK).send();
      } else if (await this.userService.isAdmin(user.id, roomId)) {
        if (
          (await this.userService.isOwner(participantId, roomId)) ||
          (await this.userService.isAdmin(participantId, roomId))
        ) {
          return res.status(HttpStatus.FORBIDDEN).send();
        }
        await this.userService.banUser(participantId, roomId);
        return res.status(HttpStatus.OK).send();
      } else {
        return res
          .status(HttpStatus.FORBIDDEN)
          .json({ message: 'User is banned' })
          .send();
      }
    } catch (error) {
      this.logger.error(error);
      res.status(error.status).json({ message: error.message }).send();
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
}

import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
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
import { InputStringValidationPipe } from 'src/pipes';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guard';
import * as bcrypt from '../utils';
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
  async updateMe(@GetMe('id') id: string, @Body() userData: any) {
    return await this.userService.updateUserById(id, userData);
  }

  @UseGuards(TwoFAGuard)
  @Get('auth')
  async getAuth(@GetMe() user: User) {
    return (await this.findById(String(user.id))).twoFactorAuthEnabled;
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/:id')
  async findById(@Param('id', InputStringValidationPipe) id: string) {
    const User = await this.userService.getUserById(id);
    return User;
  }

  @UseGuards(JwtAuthGuard)
  @Get('find/login/:login')
  async findByLogin(@Param('login', InputStringValidationPipe) login: string) {
    const User = await this.userService.getUserByLogin(login);
    if (!User) {
      throw new NotFoundException('User not found.');
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
    @Body('requesterId', InputStringValidationPipe) requesterId: string,
    @Body('requesteeId', InputStringValidationPipe) requesteeId: string,
    @Res() res: Response,
  ) {
    if (await this.userService.isBlocked(requesterId, requesteeId)) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'This user blocked you' })
        .send();
    }
    return await this.userService.addFriendRequest(requesterId, requesteeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('handle-friend-request')
  async handleFriendRequest(
    @GetMe('id') id: string,
    @Body('requesterId', InputStringValidationPipe) requesterId: string,
    @Body('requestId', InputStringValidationPipe) requestId: string,
    @Body('type', InputStringValidationPipe) type: string,
  ) {
    try {
      const result = await this.userService.handleFriendRequest(
        requesterId,
        id,
        requestId,
        type,
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
  async blockUser(
    @GetMe('id') id: string,
    @Body('blockedId', InputStringValidationPipe) blockedId: string,
  ) {
    try {
      const result = await this.userService.blockUser(id, blockedId);
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
  async getMatches(@Param('id', InputStringValidationPipe) id: string) {
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
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('matches-wins/:id')
  async getWins(@Param('id', InputStringValidationPipe) id: string) {
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
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-user/:username')
  async changeUsername(
    @GetMe() user: User,
    @Param('username', InputStringValidationPipe) username: string,
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
    const ChatRooms = await this.userService.getChatRooms(id);

    return ChatRooms;
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatRoom/:id')
  async getChatRoomById(@Param('id', InputStringValidationPipe) id: string) {
    return await this.userService.getChatRoomById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('chatHistory/:id')
  async getChatHistory(
    @GetMe('id') userId: string,
    @Param('id', InputStringValidationPipe) id: string,
  ) {
    return await this.userService.getChatHistory(userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-friend/:friendName')
  async addFriend(
    @GetMe('id') id: string,
    @Param('friendName', InputStringValidationPipe) friendName: string,
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
    @Body('login', InputStringValidationPipe) login: string,
    @Body('roomId', InputStringValidationPipe) roomId: string,
    @Body('password', InputStringValidationPipe) password: string,
    @Body('roomType', InputStringValidationPipe) roomType: string,
    @Res() res: Response,
  ) {
    if (await this.userService.isBanned(login, roomId)) {
      return res.status(HttpStatus.FORBIDDEN).send();
    }

    const joinResponse = await this.userService.joinInRoom(
      login,
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
    @Body('roomId', InputStringValidationPipe) roomId: string,
  ) {
    return await this.userService.leaveRoom(username, roomId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-admin')
  async addAdmin(
    @GetMe('login') login: string,
    @Body('chatId', InputStringValidationPipe) chatId: string,
    @Body('userId', InputStringValidationPipe) userId: string,
    @Res() res: Response,
  ) {
    try {
      await this.userService.addAdminToChat(login, chatId, userId);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User added as admin successfully' });
    } catch (error) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: error.message })
        .send();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('channelParticipants/:chatId')
  async getChannelParticipants(
    @Param('chatId', InputStringValidationPipe) chatId: string,
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
    @Query('roomId', InputStringValidationPipe) roomId: string,
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
    @Body('roomId', InputStringValidationPipe) roomId: string,
    @Body('participantId', InputStringValidationPipe) kickedId: string,
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
    @Body('roomId', InputStringValidationPipe) roomId: string,
    @Body('participantId', InputStringValidationPipe) participantId: string,
    @Res() res: Response,
  ) {
    try {
      if (await this.userService.isOwner(user.id, roomId)) {
        if (await this.userService.banUser(participantId, roomId)) {
          return res.status(HttpStatus.OK).send();
        }
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Failed to update' })
          .send();
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
  @Post('mute-user')
  async muteUser(
    @GetMe() user: User,
    @Body('participantId') participantId: string,
    @Body('roomId') roomId: string,
    @Body('duration', ParseIntPipe) duration: number,
    @Res() res: Response,
  ) {
    if (duration < 1) {
      throw new BadRequestException('Mute duration must be greater than 0');
    }

    if (!roomId || !participantId) {
      throw new BadRequestException('Missing roomId or userId');
    }

    const test = await this.userService.getUserById(participantId);
    if (!test) {
      throw new BadRequestException('User not found');
    }

    if (
      (await this.userService.isOwner(participantId, roomId)) ||
      (!(await this.userService.isOwner(user.id, roomId)) &&
        !(await this.userService.isAdmin(user.id, roomId)))
    )
      throw new ForbiddenException('You are not Owner or Admin');
    if (
      (await this.userService.isAdmin(user.id, roomId)) &&
      (await this.userService.isAdmin(participantId, roomId))
    )
      throw new ForbiddenException("You can't mute this user");
    const userAlreadyMuted = await this.prisma.mutedIn.findFirst({
      where: {
        userId: participantId,
        channelId: roomId,
      },
    });

    if (userAlreadyMuted) {
      throw new ForbiddenException('User already muted');
    }
    await this.userService.muteUser(participantId, roomId, duration);
    return res.status(HttpStatus.OK).send();
  }

  @Get('check-mute/:userId/:roomId')
  async checkUserMute(
    @Param('userId') userId: string,
    @Param('roomId') roomId: string,
  ) {
    const isMuted = await this.userService.isUserMutedInRoom(userId, roomId);
    if (!isMuted) {
      await this.userService.unmuteUser(userId, roomId);
    }
    return isMuted;
  }

  @UseGuards(JwtAuthGuard)
  @Post('unmute-user')
  async unmuteUser(
    @GetMe() user: User,
    @Body('participantId') participantId: string,
    @Body('roomId') roomId: string,
    @Res() res: Response,
  ) {
    if (!roomId || !participantId) {
      throw new BadRequestException('Missing roomId or userId');
    }

    const test = await this.userService.getUserById(participantId);
    if (!test) {
      throw new BadRequestException('User not found');
    }

    if (
      !(await this.userService.isOwner(user.id, roomId)) &&
      !(await this.userService.isAdmin(user.id, roomId))
    )
      throw new ForbiddenException('You are not Owner or Admin');
    await this.userService.unmuteUser(participantId, roomId);
    return res.status(HttpStatus.OK).send();
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-room-privacy/:roomId')
  async updateRoomPrivacy(
    @Body('type') type: any,
    @Body('password') password: string,
    @Param('roomId', InputStringValidationPipe) roomId: string,
  ) {
    if (type && password) {
      const hashedPassword = await bcrypt.hashPassword(password);
      await this.userService.updateChatRoomPrivacy(
        roomId,
        type,
        hashedPassword,
      );
    } else {
      await this.userService.updateChatRoomPrivacy(roomId, type, '');
    }
  }
}

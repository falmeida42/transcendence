import {
  Controller,
  Delete,
  Get,
  Logger,
  Body,
  HttpStatus,
  Param,
  UseGuards,
  Post,
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
  @Get('find/:login')
  async findByLogin(@Param('login') login: string) {   
      return this.userService.getUserByLogin(login);
  }


  @UseGuards(JwtAuthGuard)
  @Get('all')
  async getAll() {   
      return this.userService.getAll();
  }


  @UseGuards(JwtAuthGuard)
  @Get('friends')
  async getFriends(@GetMe('id') id: string) {   
      return this.userService.getFriends(id);
  }
  

  @UseGuards(JwtAuthGuard)
  @Get('not-friends')
  async getNotFriends(@Req() req: any) {   
      return this.userService.getNotFriends(String(req.user.id));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':login')
  async delete(@Param('login') login: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      return 'User not found';
    }

    return this.prisma.user.delete({ where: { login } });
  }

  @UseGuards(JwtAuthGuard)
  @Post(':username')
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
    //return this.userService.delete(login);
  }


  @Post('friend-request')
  async addFriendRequest(@Req() req: any, @Body() body: any) {
    try {
      const result = await this.userService.addFriendRequest(body.requesterId, body.requestedId);
      return { statusCode: HttpStatus.CREATED, ...result };
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creating friend request', error };
    }
  }

  // @Post('add-friend')
  // async addFriend(@Req() req: any, @Body() body: any) {

  //   if (!body.friendlogin)
  //   return this.userService.addFriend()
  // }
}

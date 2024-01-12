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
  async getNotFriends(@GetMe('id') id: string) {
      this.logger.debug("USER ID: ", id);    
      return this.userService.getNotFriends(id);
  }

  
  // @UseGuards(JwtAuthGuard)
  // @Post('friend-request')
  // async addFriendRequest(@Req() req: any, @Body() body: any) {
    //   try {
  //     const result = await this.userService.addFriendRequest(body.requesterId, body.requesteeId);
  //     return { statusCode: HttpStatus.CREATED, ...result };
  //   } catch (error) {
  //     return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error creating friend request', error };
  //   }
  // }
  
  @UseGuards(JwtAuthGuard)
  @Post('create-friend-request')
  async addFriendRequest(@Req() req: any, @Body() body: any) {
    this.logger.debug("AAAAA", body.requesteeId);
    return await this.userService.addFriendRequest(body.requesterId, body.requesteeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('accept-friend-request')
  async acceptFriendRequest(@GetMe('id') id: string, @Body() body: any) {
    this.logger.debug("ACCEPT FETCH BODY:");
    try {
      const result = await this.userService.acceptFriendRequest(body.requesterId, id, body.requestId);
      return { statusCode: HttpStatus.CREATED, ...result };
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error accepting friend request', error };
    }
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('friend-requests')
  async getFriendRequests(@GetMe('id') id: string) {
     this.logger.debug("USER ID: ", id);  
      return this.userService.getFriendRequests(id);
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
}

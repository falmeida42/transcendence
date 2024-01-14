import {
  Controller,
  Delete,
  Get,
  Logger,
  Body,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { TwoFAGuard } from 'src/auth/guard/2FA.guard';
import { GetMe } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guard';
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
  @Post('me')
  async updateMe(@GetMe() user: User, @Body() userData: any) {
    const updatedUser = await this.userService.updateUserById(String(user.id), userData);
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
  
  @UseGuards(JwtAuthGuard)
  @Get('blockable-users')
  async getBlockableUsers(@GetMe('id') id: string) { 
      return this.userService.getBlockableUsers(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-friend-request')
  async addFriendRequest(@Req() req: any, @Body() body: any) {
    this.logger.debug("AAAAA", body.requesteeId);
    return await this.userService.addFriendRequest(body.requesterId, body.requesteeId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('handle-friend-request')
  async handleFriendRequest(@GetMe('id') id: string, @Body() body: any) {
    this.logger.debug("ACCEPT FETCH BODY:");
    try {
      const result = await this.userService.handleFriendRequest(body.requesterId, id, body.requestId, body.type);
      return { statusCode: HttpStatus.CREATED, ...result };
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Error accepting friend request', error };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('block-user')
  async blockUser(@GetMe('id') id: string, @Body() body: any) {
    this.logger.debug("ACCEPT FETCH BODY:");
    try {
      const result = await this.userService.blockUser(id, body.blockedId);
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

  @UseGuards(JwtAuthGuard)
  @Get('matches/:id')
  async getMatches(@Param('id') id: string) {
    try {
      // this.logger.debug(id);
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
            }
          },
          losses: {
            include: {
              winner: true,
              loser: true,
            }
          }
        },
      });
      // this.logger.debug("FETCH RETURN", user);
      matches = [...user.wins, ...user.losses].sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
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
        }
      });
      
      const winsCount = user.wins.length;
      const lossesCount = user.losses.length;
      
      this.logger.debug(winsCount, lossesCount);
      return {winsCount, lossesCount};
    } catch (e) {
      this.logger.error(e.message);
    }
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':login')
  async delete(@Param('login') login: string) {
    const user = await this.prisma.user.findUnique({ where: { login } });

    if (!user) {
      return 'User not found';
    }
  }

}

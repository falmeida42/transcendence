import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Req,
  UseGuards,
  Logger,
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
    return this.findById(String(req.user.id));
  }
    
  @Post('me')
  async updateMe(@Req() req: any, @Body() userData: any) {
    const logInfo = {
      user: req.user,
    };
    this.logger.debug(JSON.stringify(logInfo));
  
    // Assuming you have a method in the userService to update user data
    const updatedUser = await this.userService.updateUserById(String(req.user.id), userData);
  
    return updatedUser;
  }

  @Get(':id')
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
}

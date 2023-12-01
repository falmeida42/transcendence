import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto';
import { AuthDto } from './dto/auth.dto';
import { FTGuard } from './strategy';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: UserDto) {
    return this.authService.signup(dto);
  }

  // @Post('login')
  // login(@Body() dto: UserDto) {
  //   return this.authService.login(dto);
  // }

  @UseGuards(FTGuard)
  @Get('login')
  login() {
    return;
  }

  // For testing purposes
  @UseGuards(FTGuard)
  @Get('intra-clbk')
  callbackIntra(@Req() req: any, @Res() res: any) {
    return res.json('OLA');
  }
}

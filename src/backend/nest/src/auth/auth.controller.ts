import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard } from '../auth/guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FTGuard)
  @Get('login')
  login() {
    return;
  }

  @UseGuards(FTGuard)
  @Get('intra-clbk')
  callbackIntra(@Req() req: any): any {
    console.log('Request user:');
    console.log(req.user);
    return req.user;
  }
}

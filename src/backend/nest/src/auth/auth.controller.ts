import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard } from '../auth/guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FTGuard)
  @Get('login')
  login() {}

  @UseGuards(FTGuard)
  @Get('intra-clbk')
  callbackIntra(@Req() req: any, @Res() res: any): any {
    console.log('Request user:', req.user);
    return res.redirect(process.env.FRONTEND_URL);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // logout(@Req() req: any) {
  //   // TODO: validate user token
  //   req.logout();
  //   return 'Logged out successfully';
  // }
}

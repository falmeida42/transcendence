import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Body,
  Post,
  Logger,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard } from '../auth/guard';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private readonly logger = new Logger('AuthController');

  @UseGuards(FTGuard)
  @Get('login')
  login() {}

  @UseGuards(FTGuard)
  @Get('intra-clbk')
  callbackIntra(@Req() req: any, @Res() res: any): any {
    this.logger.log('Request user:', req.user);
    this.logger.log('Token:', req.user.access_token);
    return res.redirect(`${process.env.FRONTEND_URL}/?token=${req.user.token}`);
  }

  // For testing purposes
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    this.logger.log(dto);
    return this.authService.signup(dto);
  }
}

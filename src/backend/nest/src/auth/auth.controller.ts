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
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  private readonly logger = new Logger('AuthController');

  @UseGuards(FTGuard)
  @Get('login')
  login() {}

  @UseGuards(FTGuard)
  @Get('intra-clbk')
  callbackIntra(@Req() req: any, @Res() res: any): any {
    this.logger.debug('Request user:', req.user);
    this.logger.debug('Token:', req.user.access_token);

    return res.redirect(`${process.env.FRONTEND_URL}/?token=${req.user.token}`);
  }

  // For testing purposes
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    this.logger.debug(dto);

    return this.authService.signup(dto);
  }

  @Post('2fa/generate')
  async register(@Res() res, @Req() req) {
    const secret = await this.authService.generate2FASecret();
    const otpAuthURL = await this.authService.generateTwoFactorKeyURI(
      req.user,
      secret,
    );
    await this.authService.set2FASecret(req.user.login, secret);
    return res.json(await this.authService.generateQrCodeURL(otpAuthURL));
  }

    // TODO: WIP
  // @Post('2fa/turn-on-off')
  // async twoFactorAuthOnOff(@Req() req, @Body() body) {
  //   await this.userService
  //     .isTwoFactorAuthEnabled(req.user.login)
  //     .then((result) => {
  //       this.logger.debug(result);

  //       if (result === false) {
  //         const codeValid = this.authService.twoFactorAuthCodeValid();
  //       }
  //     })
  //     .catch((error) => this.logger.error(error));

  // }
}

import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Body,
  Post,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard, JwtAuthGuard } from '../auth/guard';
import { AuthDto } from './dto';
import { UserService } from '../user/user.service';
import { User } from '@prisma/client';

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

  // TODO: WIP
  // @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async register(@Res() res: any, @Req() @Body() req: any) {
    console.log('Request: ', req);
    this.logger.debug(res.user);

    // generate 2FA secret
    const secret = await this.authService.generate2FASecret();
    // generate key uri
    const otpAuthURL = await this.authService.generate2FAKeyURI(
      req.user,
      secret,
    );

    this.logger.debug('secret: ', secret);
    this.logger.debug('otp url: ', otpAuthURL);

    // update user data
    const user = await this.userService.set2FASecret(
      String(req.user.id),
      secret,
    );
    if (!user) {
      this.logger.error('User not updated');
    }
    // generate QR code
    return res.json(await this.authService.generateQrCodeURL(otpAuthURL));
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('2fa/turn-on')
  // async turn2FAOn(@Body() body: any) {
  //   this.logger.debug(body.user);

  //   if (
  //     (await this.userService.is2FAEnabled(body.user.id)).valueOf() === false
  //   ) {
  //     const isCodeValid = this.authService.is2FACodeValid(
  //       body.twoFactorAuthCode,
  //       body.user,
  //     );

  //     if (!isCodeValid) {
  //       throw new UnauthorizedException('Wrong 2FA code');
  //     }

  //     await this.userService.set2FAOn(body.user.id);
  //     return await this.authenticate2FA(body);
  //   }
  //   return { message: '2FA is already on' };
  // }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-off')
  async turn2FAOff(@Req() req: any, @Body() body: any) {
    if ((await this.userService.is2FAEnabled(body.user.id)) === true) {
      const isCodeValid = this.authService.is2FACodeValid(
        body.twoFactorAuthenticationCode,
        req.user,
      );

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong 2FA code');
      }

      await this.userService.set2FAOff(req.user.id);
      return await this.authenticate2FA(body);
    }
    return { message: '2FA is already off' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/authentication')
  async authenticate2FA(@Body() body: any) {
    const codeValid = await this.authService.is2FACodeValid(
      body.twoFactorAuthenticationCode,
      body.user,
    );

    if (!codeValid) {
      throw new UnauthorizedException('Wrong 2FA code');
    }
    return { message: '2FA code is valid' };
  }
}

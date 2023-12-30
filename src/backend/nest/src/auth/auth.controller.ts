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
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard, JwtAuthGuard } from '../auth/guard';
import { UserService } from '../user/user.service';
import { GetMe } from 'src/decorators';
import { User } from '@prisma/client';
import { twoFAGuard } from './guard/2FA.guard';

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
  async callbackIntra(@Req() req: any, @Res() res: any): Promise<any> {
    this.logger.debug('Request user:', req.user);

    if (await this.authService.is2FAActive(String(req.user.id))) {
      this.logger.debug('2FA IS ENABLED');

      const user = this.userService.getUserById(req.user.id);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // TODO: send to frontend here
      const token2fa = await this.authService.sign2FAToken(req.user.id);
      return res.redirect(`${process.env.FRONTEND_URL}/?token2fa=${token2fa}`);
    }

    const data = await this.authService.signup(req.user);
    this.logger.debug('Token:', data.token);

    return res.redirect(`${process.env.FRONTEND_URL}/?token=${data.token}`);
  }

  // For testing purposes
  // @Post('signin-test')
  // signin(@Body() dto: AuthDto) {
  //   this.logger.debug(dto);

  //   return this.authService.signup(dto);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async register(@Res() res: any, @GetMe() user: User) {
    this.logger.debug(res.user);

    // generate 2FA secret
    const secret = await this.authService.generate2FASecret();
    // generate key uri
    const otpAuthURL = await this.authService.generate2FAKeyURI(user, secret);

    this.logger.debug('secret: ', secret);
    this.logger.debug('otp url: ', otpAuthURL);

    // update user data
    if (await this.userService.set2FASecret(String(user.id), secret)) {
      // generate QR code
      return res.json(await this.authService.generateQrCodeURL(otpAuthURL));
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  async turn2FAOn(
    @GetMe() user: User,
    @Body('code') code: string,
    @Res() res: any,
  ) {
    this.logger.debug(user);

    if ((await this.userService.is2FAEnabled(user.id)).valueOf() === false) {
      // TODO: Check if 2FA has been generated before, generate if not
      // TODO: Send code to frontend

      const isCodeValid = this.authService.is2FACodeValid(code, user);

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong 2FA code');
      }

      await this.userService.set2FAOn(user.id);
      return await this.authenticate2FA(code, user.id, res); // Do I really need to authenticate here??
    }
    return { message: '2FA is already on' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-off')
  async turn2FAOff(@GetMe() user: User, @Body() body: any, @Res() res: any) {
    if ((await this.userService.is2FAEnabled(body.user.id)) === true) {
      const isCodeValid = this.authService.is2FACodeValid(
        body.twoFactorAuthenticationCode,
        user,
      );

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong 2FA code');
      }

      const authenticated = await this.authenticate2FA(body, user.id, res);
      if (!authenticated) {
        throw new ForbiddenException('User not authenticated');
      }
      await this.userService.set2FAOff(user.id);
    }
    return { message: '2FA is already off' };
  }

  @UseGuards(twoFAGuard)
  @Post('2fa/authentication')
  async authenticate2FA(
    @Body('code') code: string,
    @Body('id') id: string,
    @Res() res: any,
  ) {
    this.logger.debug('code: ', code);

    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new ForbiddenException('No such id ', user.id);
    }

    const isCodeValid = this.authService.is2FACodeValid(code, user);

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong 2FA code');
    }

    const token = await this.authService.signToken(Number(user.id), user.login);

    this.logger.log('Token: ', token);
    return res.redirect(`${process.env.FRONTEND_URL}/?token=${token}}`);
  }
}

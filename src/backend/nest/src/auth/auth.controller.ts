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
import { AuthDto } from './dto';
import { UserService } from '../user/user.service';
import { GetMe } from 'src/decorators';
import { User } from '@prisma/client';
import { UserDto } from 'src/user/dto';

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

    const twoFactorEnabled = await this.authService.is2FAActive(
      String(req.user.id),
    );
    if (twoFactorEnabled) {
      this.logger.debug('2FA IS ENABLED');

      // TODO: need to validate with QR code instead

      const user = this.userService.getUserById(req.user.id);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      return this.register(res, req);
    }
    const data = await this.authService.signup(req.user);
    this.logger.debug('Token:', data.token);

    return res.redirect(`${process.env.FRONTEND_URL}/?token=${data.token}`);
  }

  // For testing purposes
  @Post('signin-test')
  signin(@Body() dto: AuthDto) {
    this.logger.debug(dto);

    return this.authService.signup(dto);
  }

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

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  async turn2FAOn(@Body() body: any) {
    this.logger.debug(body.user);

    if (
      (await this.userService.is2FAEnabled(body.user.id)).valueOf() === false
    ) {
      const isCodeValid = this.authService.is2FACodeValid(
        body.twoFactorAuthCode,
        body.user,
      );

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong 2FA code');
      }

      await this.userService.set2FAOn(body.user.id);
      // return await this.authenticate2FA(body); // Do I really need to authenticate here??
    }
    return { message: '2FA is already on' };
  }

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
      // return await this.authenticate2FA(body); // Do I really need to authenticate here??
    }
    return { message: '2FA is already off' };
  }

  // TODO: Use 2fa specific guard maybe
  // // @UseGuards(twoFAGuard)
  // @Post('2fa/authentication')
  // async authenticate2FA(
  //   // @GetMe() user: User,
  //   @Body() body: any,
  //   @Res() res: any,
  // ) {
  //   const codeValid = await this.authService.is2FACodeValid(
  //     body.twoFactorAuthenticationCode,
  //     body.user,
  //   );

  //   if (!codeValid) {
  //     throw new UnauthorizedException('Wrong 2FA code');
  //   }

  //   // TODO: sign token here
  //   // this.authService.signup()

  //   // TODO: redirect to home page
  //   return res.redirect(`${process.env.FRONTEND_URL}/?token=${body.token}`);
  // }

  @Get('2fa/:user')
  async signToken(@Body() dto: UserDto, @Res() res: any) {
    this.logger.debug('User: ', dto);

    // TODO: validate 2FA
    // const isCodeValid = this.authService.is2FACodeValid(
    //   body.twoFactorAuthenticationCode,
    //   dto,
    // );

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong 2FA code');
    }

    const data = await this.authService.signup(dto);
    this.logger.log('Token: ', data.token);
    return res.redirect(`${process.env.FRONTEND_URL}/?token=${data.token}`);
  }
}

import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Body,
  Post,
  Logger,
  Query,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FTGuard, JwtAuthGuard } from '../auth/guard';
import { UserService } from '../user/user.service';
import { GetMe } from 'src/decorators';
import { User } from '@prisma/client';
import { twoFAGuard } from './guard/2FA.guard';
import { Response } from 'express';

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
  async callbackIntra(@Req() req: any, @Res() res: Response): Promise<any> {
    this.logger.debug('Request user:', req.user);

    if (await this.authService.is2FAActive(String(req.user.id))) {
      this.logger.debug('2FA IS ENABLED');

      const user = await this.userService.getUserById(req.user.id);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      // TODO: send to frontend here
      const token2fa = await this.authService.sign2FAToken(req.user.id);
      res.cookie('token', token2fa, { expires: new Date(Date.now() + 300000), httpOnly: true });
      return res.redirect(`${process.env.FRONTEND_URL}`);
    }

    const data = await this.authService.signup(req.user);
    this.logger.debug('Token:', data.token);

    return res.redirect(`${process.env.FRONTEND_URL}/?token=${data.token}`);
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async register(@Res() res: any, @GetMe('id') id: string) {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    let secret: string;
    this.logger.debug(user.twoFactorAuthSecret);
    // if no secret
    if (!user.twoFactorAuthSecret) {
      try {
        console.debug('PASSOU!!!!!!!!');
        // generate 2FA secret
        secret = await this.authService.generate2FASecret();
        // update user data
        await this.userService.set2FASecret(String(user.id), secret);
      } catch (error) {
        console.error(error);
        return { message: error };
      }
    }

    // generate key uri
    const otpAuthURL = await this.authService.generate2FAKeyURI(user, secret);

    this.logger.debug('secret: ', secret);
    this.logger.debug('otp url: ', otpAuthURL);

    // generate QR code
    return res.json(await this.authService.generateQrCodeURL(otpAuthURL));
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  async turn2FAOn(@GetMe() user: User, @Body('code') code: string) {
    // const user = await this.userService.getUserById(id);

    this.logger.debug(code);
    if ((await this.userService.is2FAEnabled(user.id)).valueOf() === false) {
      if (!user.twoFactorAuthSecret) {
        // TODO: Check if 2FA has been generated before, generate if not
      }

      const isCodeValid = this.authService.is2FACodeValid(code, user);

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong 2FA code');
      }

      await this.userService.set2FAOn(user.id);
    }
    return { message: '2FA is already on' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-off')
  async turn2FAOff(@GetMe('id') id: string, @Body('code') code: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new ForbiddenException('No such user');
    }

    if ((await this.userService.is2FAEnabled(id)) === true) {
      const isCodeValid = this.authService.is2FACodeValid(code, user);

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong 2FA code');
      }

      const updated = await this.userService.set2FAOff(id);
      this.logger.debug(updated);
    }
    return { message: '2FA is already off' };
  }

  @UseGuards(twoFAGuard)
  @Post('2fa/authentication')
  async authenticate2FA(@Res() res: Response, @Query('token') token: string,
    @GetMe() id: any,
    @Body('code') code: string,
  ) {
    this.logger.debug('code: ', code);

    const user = await this.userService.getUserById(id.id);

    if (!user) {
      throw new ForbiddenException('No such id ', user.id);
    }

    const isCodeValid = this.authService.is2FACodeValid(code, user);

    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong 2FA code');
    }

    const tokenPerm = await this.authService.signToken(Number(user.id), user.login);

    this.logger.log('Token: ', token);
    res.cookie('token', tokenPerm, { expires: new Date(Date.now() + 300000), httpOnly: true });
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }
}

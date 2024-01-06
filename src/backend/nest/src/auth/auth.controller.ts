import {
  Controller,
  Get,
  UseGuards,
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
import { TwoFAGuard } from './guard/2FA.guard';
import { Response } from 'express';
import { Req } from '@nestjs/common';

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
      // Execute 2FA logic
      this.logger.debug('2FA IS ENABLED');

      const user = await this.userService.getUserById(req.user.id);
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const token2fa = await this.authService.sign2FAToken(req.user.id);
      res.cookie('token', token2fa, {
        expires: new Date(Date.now() + 300000),
        httpOnly: true,
      });
      return res.redirect(`${process.env.FRONTEND_URL}`);
    }
    // Execute login without 2FA

    const data = await this.authService.signup(req.user);

    if (!data) {
      return { message: 'Login was unsuccessfull' };
    }

    this.logger.debug('Access token:', data.accessToken);

    return res.redirect(
      `${process.env.FRONTEND_URL}/?token=${data.accessToken}&2faOn=false`,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async register(@Res() res: any, @GetMe() user: User) {
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    let secret: string;
    // if no secret
    if (!user.twoFactorAuthSecret) {
      try {
        // generate 2FA secret
        secret = this.authService.generate2FASecret();
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
    this.logger.debug(code);
    if ((await this.userService.is2FAEnabled(user.id)).valueOf() === false) {
      if (!user.twoFactorAuthSecret) {
        throw new ForbiddenException('2FA secret not set');
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
  async turn2FAOff(@GetMe() user: User, @Body('code') code: string) {
    if (!user) {
      throw new ForbiddenException('No such user');
    }

    if ((await this.userService.is2FAEnabled(user.id)) === true) {
      const isCodeValid = this.authService.is2FACodeValid(code, user);

      if (!isCodeValid) {
        throw new UnauthorizedException('Wrong 2FA code');
      }

      const updated = await this.userService.set2FAOff(user.id);
      this.logger.debug(updated);
    }
    return { message: '2FA is already off' };
  }

  @UseGuards(TwoFAGuard)
  @Post('2fa/authentication')
  async authenticate2FA(
    @Res() res: Response,
    @GetMe('id') id: string,
    @Body('code') code: string,
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

    const tokenPerm = await this.authService.signAccessToken(Number(user.id));

    res.cookie('token', tokenPerm, {
      expires: new Date(Date.now() + 300000),
      httpOnly: true,
    });
    return res.redirect(`${process.env.FRONTEND_URL}`);
  }
}

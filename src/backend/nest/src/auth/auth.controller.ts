import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Response } from 'express';
import { GetMe } from 'src/decorators';
import { FTGuard, JwtAuthGuard } from '../auth/guard';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { TwoFAGuard } from './guard/2FA.guard';

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
    const dto: AuthDto = req.user;
    try {
      if (await this.authService.is2FAActive(String(dto.id))) {
        // Execute 2FA logic
        this.logger.debug('2FA IS ENABLED');

        const user = await this.userService.getUserById(dto.id);
        if (!user) {
          throw new ForbiddenException('User not found');
        }
        this.logger.debug('USER: ', user);

        const token = await this.authService.sign2FAToken(user.id);

        // this.logger.debug('ACCESS TOKEN: ', token);

        res
          .cookie('token2fa', token, {
            expires: new Date(Date.now() + 2 * 60 * 1000),
            domain: 'localhost',
            path: '/',
            sameSite: 'none',
            secure: true,
          })
          .redirect(`${process.env.FRONTEND_URL}`);
        return;
      }
    } catch {}
    // Execute login without 2FA

    const data = await this.authService.signup(dto);
    // this.logger.debug('Token:', data.accessToken);
    res
      .cookie('token', data.accessToken, {
        // expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        expires: new Date(Date.now() + 15 * 60 * 1000),
        domain: 'localhost',
        path: '/',
        sameSite: 'none',
        secure: true,
      })
      .redirect(`${process.env.FRONTEND_URL}`);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/generate')
  async register(@Res() res: Response, @GetMe() user: User) {
    if (!user) {
      throw new ForbiddenException('User does not exist');
    }

    if (!user.twoFactorAuthSecret) {
      try {
        // generate 2FA secret
        const secret = this.authService.generate2FASecret();
        // update user data
        await this.userService.set2FASecret(String(user.id), secret);
      } catch (error) {
        console.error(error);
        return res.status(HttpStatus.NOT_IMPLEMENTED).send(error);
      }
    }

    // generate key uri
    const otpAuthURL = await this.authService.generate2FAKeyURI(user);

    // this.logger.debug('secret: ', secret);
    // this.logger.debug('otp url: ', otpAuthURL);

    // generate QR code
    return res.json(await this.authService.generateQrCodeURL(otpAuthURL));
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-on')
  async turn2FAOn(
    @GetMe() user: User,
    @Body('code') code: string,
    @Res() res: Response,
  ) {
    // this.logger.debug(code);
    if ((await this.userService.is2FAEnabled(user.id)).valueOf() === false) {
      if (!user.twoFactorAuthSecret) {
        throw new ForbiddenException('2FA secret not set');
      }

      const isCodeValid = await this.authService.is2FACodeValid(code, user);
      this.logger.debug(isCodeValid);

      if (isCodeValid === false) {
        return res.status(401).json({ error: 'Wrong 2FA code' });
        // res.send(res);
        // throw new ForbiddenException('Wrong 2FA code');
      }

      await this.userService.set2FAOn(user.id);
      return res.status(200).json({ message: '2FA ON' });
    }
    return { message: '2FA is already on' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/turn-off')
  async turn2FAOff(@GetMe('id') id: string) {
    if ((await this.userService.is2FAEnabled(id)) === true) {
      this.logger.debug('ass');
      try {
        await this.userService.set2FAOff(id);
      } catch (error) {
        console.error(error);
        return { error: error, message: 'Failed to turn off 2FA' };
      }
      return { message: '2FA disabled' };
    }
    return { message: '2FA is already off' };
  }

  @UseGuards(TwoFAGuard)
  @Post('2fa/authentication')
  async authenticate2FA(
    @Res() res: Response,
    @GetMe('id') id: string,
    @Body() body: any,
  ) {
    // this.logger.debug('code: ', code);

    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new ForbiddenException('No such id ', user.id);
    }

    const isCodeValid = await this.authService.is2FACodeValid(body.code, user);

    if (!isCodeValid) {
      // this.logger.debug('code: ', JSON.stringify(body));
      res
        // .status(401)
        .redirect(`${process.env.FRONTEND_URL}/2fa`);
      return;
      throw new ForbiddenException('Wrong 2FA code');
    }
    const tokenPerm = await this.authService.signAccessToken(Number(user.id));

    res
      .cookie('token', tokenPerm, {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        domain: 'localhost',
        path: '/',
        sameSite: 'none',
        secure: true,
      })
      .redirect(`${process.env.FRONTEND_URL}`);
    // this.logger.debug('ACCESS TOKEN: ', tokenPerm);
    return;
  }
}

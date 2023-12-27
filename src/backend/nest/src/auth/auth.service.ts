import { Injectable, Logger } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { User } from '@prisma/client';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger('AuthService');

  async signup(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { login: dto.login },
      });

      if (user) {
        const token = await this.signToken(Number(user.id), user.login);
        return { token: token, user: user };
      }

      const newUser = await this.prisma.user.create({
        data: {
          id: dto.id,
          email: dto.email,
          login: dto.login,
          image: dto.image,
          username: dto.username,
          first_name: dto.first_name,
          last_name: dto.last_name,
          twoFactorAuthSecret: '',
          twoFactorAuthEnabled: false,
        },
      });
      this.logger.log('New user: ', newUser);

      if (newUser) {
        const token = await this.signToken(Number(newUser.id), newUser.login);
        return { token: token, user: newUser };
      }
    } catch (error) {
      this.logger.error(error);
    }
    return null;
  }

  async signToken(userId: number, login: string): Promise<string> {
    const payload = { sub: userId, login: login };

    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async generate2FASecret() {
    return authenticator.generateSecret();
  }

  async generate2FAKeyURI(user: User, secret: string) {
    return authenticator.keyuri(user.login, 'transcendence', secret);
  }

  async generateQrCodeURL(otpAuthURL: string) {
    return toDataURL(otpAuthURL);
  }

  is2FACodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthSecret,
    });
  }

  // TODO: WIP
  // async authenticate2FA(user: User) {
  //   const payload = {
  //     login: user.login,
  //     isTwoFactorAuthenticationEnabled: user.twoFactorAuthEnabled,
  //     isTwoFactorAuthenticated: true,
  //   };

  //   return {
  //     login: payload.login,
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}

import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { User } from '@prisma/client';
import { toDataURL } from 'qrcode';
import { AuthDto } from './dto';

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
        where: { id: dto.id },
      });

      if (user) {
        const accessToken = await this.signAccessToken(Number(user.id));
        // const refreshToken = await this.signRefreshToken(Number(user.id));
        return {
          accessToken: accessToken,
          // refreshToken: refreshToken,
          user: user,
        };
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
      // this.logger.debug('New user: ', newUser);

      if (newUser) {
        const accessToken = await this.signAccessToken(Number(newUser.id));
        // const refreshToken = await this.signRefreshToken(Number(user.id));
        return {
          accessToken: accessToken,
          // refreshToken: refreshToken,
          user: user,
        };
      }
    } catch (error) {
      this.logger.error(error);
    }
    return null;
  }

  async signAccessToken(userId: number): Promise<string> {
    const payload = { sub: userId };

    return await this.jwtService.signAsync(payload, {
      expiresIn: '20m',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  generate2FASecret() {
    return authenticator.generateSecret();
  }

  async generate2FAKeyURI(user: User) {
    if (!user) {
      throw new ForbiddenException('User is undefined');
    }
    return authenticator.keyuri(user.id, 'transcendence', user.twoFactorAuthSecret);
  }

  async generateQrCodeURL(otpAuthURL: string) {
    return toDataURL(otpAuthURL);
  }

  async is2FACodeValid(twoFactorAuthenticationCode: string, user: User) {
    // this.logger.debug(twoFactorAuthenticationCode, user);

    if (!user.twoFactorAuthSecret) {
      throw new ForbiddenException('2FA secret is not set');
    }
    // this.logger.debug(twoFactorAuthenticationCode, user.twoFactorAuthSecret);
    const res = await authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthSecret,
    });
    // this.logger.debug('res',res)
    return res;
  }

  async is2FAActive(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: id } });
      if (!user) {
        throw new ForbiddenException('User is not in database. id: ', id);
      }
      return user.twoFactorAuthEnabled;
    } catch (error) {
      console.error(error);
    }
  }

  async sign2FAToken(id: string): Promise<string> {
    const payload = { sub: id };

    return this.jwtService.signAsync(payload, {
      expiresIn: '10m',
      secret: this.config.get('JWT_2FA_SECRET'),
    });
  }
}

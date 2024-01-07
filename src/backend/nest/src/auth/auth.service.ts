import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
}

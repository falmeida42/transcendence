import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    try {
      const user = this.prisma.user.findUnique({ where: { login: dto.login } });

      if (user) {
        return user;
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
      console.log('New user: ', newUser);
      return newUser;
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}

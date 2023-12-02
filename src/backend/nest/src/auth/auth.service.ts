import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto';
import { AuthDto } from './dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { FTStrategy } from './strategy/auth.strategy';

@Injectable()
export class AuthService {
  constructor(private user: UserService, private strategy: FTStrategy) {}

  async signup(dto: UserDto) {
    const user = await this.user.create({
      id: dto.id,
      email: dto.email,
      login: dto.login,
      image: dto.image,
      username: dto.username,
      first_name: dto.first_name,
      last_name: dto.last_name,
    });
    return user;
  }

  async login(dto: UserDto) {
    const user = await this.user.getUserByLogin(dto.login);

    if (!user) throw new ForbiddenException('Invalid user');

    // TODO: ...
  }
}

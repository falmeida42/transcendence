import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDto } from '../user/dto';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { FTStrategy } from './strategy/auth.strategy';

@Injectable()
export class AuthService {
  constructor(private user: UserService, private strategy: FTStrategy) {}

  async signup(dto: UserDto) {
    try {
      const user = await this.user.create({
        id: dto.id,
        email: dto.email,
        login: dto.login,
        image: dto.image,
        username: dto.username,
        first_name: dto.first_name,
        last_name: dto.last_name,
      });
      console.log(user);
      return user;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  async login(dto: UserDto) {
    const user = await this.user.getUserByLogin(dto.login);

    if (!user) throw new ForbiddenException('Invalid user');

    // TODO: ...
  }
}

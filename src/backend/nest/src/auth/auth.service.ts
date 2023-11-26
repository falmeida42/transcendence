import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private user: UserService) {}

  async signup(dto: UserDto) {
    const user = await this.user.create({
      id: dto.id,
      email: dto.email,
      login: dto.login,
      username: dto.username,
      first_name: dto.first_name,
      last_name: dto.last_name,
    });
    return user;
  }

  async login(dto: UserDto) {
    const user = await this.user.getUserByLogin(dto.login);

    if (!user) throw new ForbiddenException('Invalid user');

    // ...
  }
}

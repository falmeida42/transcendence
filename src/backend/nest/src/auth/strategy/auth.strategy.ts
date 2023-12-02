import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { UserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private userServ: UserService, config: ConfigService) {
    super({
      clientID: config.get('INTRA_CLIENT_ID'),
      clientSecret: config.get('INTRA_CLIENT_SECRET'),
      callbackURL: config.get('INTRA_CALLBACK_URL'),
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {

  const user = await this.userServ.getUserById(profile.id);

  if (user) {
      return user;
    }

    const newUser: UserDto = {
      id: profile.id,
      email: profile._json.email,
      login: profile._json.login,
      image: profile._json.image.link,
      first_name: profile._json.first_name,
      last_name: profile._json.last_name,
      username: 'placeholder',
    };

    console.log(newUser);

    const savedUser = this.userServ.create(newUser);

    return savedUser;
  }
}

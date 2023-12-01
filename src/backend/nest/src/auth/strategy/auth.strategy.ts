import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { UserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(private userServ: UserService) {
    super({
      clientID: 'u-s4t2ud-bfb91e41c5480c4a982916ccf8a4a8609591da877f07bdeb7a43c253f2c91ed3',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/auth/intra-clbk',
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
    });
    // TODO: Data should be kept as env variable
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {

  const user = await this.userServ.getUserById(Number(profile.id));

    console.log(profile);

  if (user) {
      return user;
    }

    const newUser: UserDto = {
      id: profile.id,
      email: profile._json.email,
      login: profile._json.login,
      first_name: profile._json.first_name,
      last_name: profile._json.last_name,
    };

    console.log(newUser);

    return true;
  }
}

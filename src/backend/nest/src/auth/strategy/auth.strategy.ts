import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthDto } from '../dto';
import { AuthService } from '../auth.service';

@Injectable()
export class FTStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private authService: AuthService,
    config: ConfigService,
  ) {
    super({
      clientID: config.get('INTRA_CLIENT_ID'),
      clientSecret: config.get('INTRA_CLIENT_SECRET'),
      callbackURL: config.get('INTRA_CALLBACK_URL'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any | null> {
    const dto: AuthDto = {
      id: profile.id,
      email: profile._json.email,
      login: profile._json.login,
      image: profile._json.image.link,
      first_name: profile._json.first_name,
      last_name: profile._json.last_name,
      username: profile._json.login,
    };

    const data = await this.authService.signup(dto);

    return data;
  }
}

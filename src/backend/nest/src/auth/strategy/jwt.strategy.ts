import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      session: false, // disable sessions
    });
  }

  async validate(payload: any) {
    console.debug('JwtStrategy.validate', payload);
    const user = await this.userService.getUserById(String(payload.sub));
    return { id: payload.sub, ...user };
  }
}

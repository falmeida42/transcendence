import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userServ: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.id);
  }

  async deserializeUser(payload: any, done: (err: Error, user: any) => void): Promise<any> {
    console.log(payload);

    const userId = await this.userServ.getUserById(payload);

    if (!userId) {
      console.log('No user id retrieved');
      done(null, null);
    }
    done(null, userId);
  }
}

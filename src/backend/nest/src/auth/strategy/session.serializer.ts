import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { PrismaService } from 'src/prisma/prisma.service';

  // TODO: Session based authentication. Unused atm
@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private prisma: PrismaService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user.id);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, user: any) => void,
  ): Promise<any> {
    console.log(payload);

    const user = this.prisma.user.findUnique({ where: { id: payload.id } });

    if (!user) {
      console.log('No user id retrieved');
      done(null, null);
    }
    done(null, user);
  }
}

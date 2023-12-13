import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { FTStrategy } from './strategy/42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guard';
// Session based authentication
import { SessionSerializer } from './strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ session: false }), // Session based authentication
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    PrismaModule,
    UserModule,
  ],
  providers: [
    AuthService,
    FTStrategy,
    JwtStrategy,
    // SessionSerializer, // TODO: Session based authentication. Unused atm
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

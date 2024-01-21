import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TwoFAStrategy } from './strategy/2fa.strategy';
import { FTStrategy } from './strategy/42.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

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
  providers: [AuthService, FTStrategy, JwtStrategy, TwoFAStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

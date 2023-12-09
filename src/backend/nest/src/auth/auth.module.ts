import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { FTStrategy } from './strategy/auth.strategy';
import { JwtModule } from '@nestjs/jwt';
// // Session based authentication
import { SessionSerializer } from './strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guard';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [
    AuthService,
    FTStrategy,
    JwtStrategy,
    SessionSerializer, // Session based authentication
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

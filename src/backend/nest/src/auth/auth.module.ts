import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { FTStrategy } from './strategy/auth.strategy';
import { SessionSerializer } from './strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PrismaModule, UserModule, PassportModule.register({ session: true })],
  providers: [AuthService, FTStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}

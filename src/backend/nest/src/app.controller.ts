import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { FTGuard, JwtAuthGuard } from './auth/guard';
import { AuthService } from './auth/auth.service';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authServce: AuthService,
  ) {}

  // @UseGuards(FTGuard)
  // @Post('login')
  // async login(@Req() req): any {
  //   return 'Hi';
  // }
}

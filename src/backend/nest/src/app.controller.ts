import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';

@Controller('home')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authServce: AuthService,
  ) {}
  @Get()
  async getHome() {
    return { Res: 'Success' };
  }
}

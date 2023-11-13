import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('home')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get42(@Res() res: Response): string {
    const responseWellcome = this.appService.get42();
    res.send(responseWellcome);
    return responseWellcome;
  }
}

import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/home')
  get42(@Res() res: Response): string {
    const responseWellcome = this.appService.get42();
    res.send(responseWellcome);
    return responseWellcome;
  }
}

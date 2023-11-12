import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller("home")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  get42(@Res() res: Response): string {
    res.send("Wellcome to transcendence #Api response");
    return "Wellcome to transcendence #Api response"
  }
}

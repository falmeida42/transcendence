import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  get42(): string {
    return 'Wellcome to transcendence #Api response';
  }
}

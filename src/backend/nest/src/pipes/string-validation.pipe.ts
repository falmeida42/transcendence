import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class InputStringValidationPipe implements PipeTransform {
  transform(value: any) {
    value.trim();
    if (value === undefined || value === null) {
      throw new BadRequestException('Invalid input');
    }
    return String(value);
  }
}

import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';

@Injectable()
export class InputStringValidationPipe implements PipeTransform {
  private readonly logger = new Logger('AuthController');

  transform(value: any) {
    const trimmedValue = String(value).trim();
    if (trimmedValue === '' || value === undefined || value === null) {
      this.logger.error('Invalid input ', trimmedValue);
      throw new BadRequestException('Invalid input ', trimmedValue);
    }
    return trimmedValue;
  }
}

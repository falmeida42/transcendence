import { IsNumber, IsString } from 'class-validator';
export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  login: string;

  @IsString()
  username: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;
}

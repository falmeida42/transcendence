import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsNumber()
  id: number;

  @IsString()
  email: string;

  @IsString()
  login: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name: string;
}

import { IsDataURI, IsEmail, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  id: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  login: string;

  @IsString()
  @IsDataURI()
  image: string;

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

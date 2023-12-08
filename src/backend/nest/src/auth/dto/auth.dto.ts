import { IsDataURI, IsOptional, IsString } from 'class-validator';

export class AuthDto {
  @IsString()
  id: string;

  @IsString()
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

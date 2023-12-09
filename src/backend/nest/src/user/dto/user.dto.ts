import { IsBoolean, IsDataURI, IsOptional, IsString } from 'class-validator';

export class UserDto {
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

  @IsString()
  twoFactorAuthSecret: string;

  @IsBoolean()
  twoFactorEnabled: boolean;
}

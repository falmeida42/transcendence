import { IsBoolean, IsDataURI, IsOptional, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  id: string;

  @IsString()
  @IsOptional()
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
  @IsOptional()
  twoFactorAuthSecret: string;

  @IsBoolean()
  twoFactorAuthEnabled: boolean;

  @IsString()
  @IsOptional()
  chatRoomId: string;
}

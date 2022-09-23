import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  identity_number: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phone_number: string;

  @IsString()
  //@IsNotEmpty()
  @ApiProperty()
  password: string;
}

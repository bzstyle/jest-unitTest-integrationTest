import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  first_name: string;

  @ApiProperty({ required: false })
  @IsString()
  last_name: string;

  @ApiProperty({ required: false })
  @IsString()
  phone_number: string;
}

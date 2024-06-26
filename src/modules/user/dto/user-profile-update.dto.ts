import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName: string;
}

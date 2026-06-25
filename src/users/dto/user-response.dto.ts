import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '2026-06-25T15:14:03.473Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-25T15:14:03.473Z' })
  updatedAt: Date;
}

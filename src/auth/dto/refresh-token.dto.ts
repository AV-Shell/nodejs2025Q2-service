import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'some token', description: 'refresh token' })
  readonly refreshToken: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class AuthModel {
  @ApiProperty({ type: String, description: 'Access token' })
  access_token = '';
  @ApiProperty({ type: String, description: 'Refresh token' })
  refresh_token = '';

  constructor(partial?: Partial<AuthModel>) {
    Object.assign(this, partial);
  }
}

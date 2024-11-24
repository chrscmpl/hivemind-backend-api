import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiY2hyc2NtcGwiLCJpYXQiOjE3MzI0NTgxNjQsImV4cCI6MTczMjU0NDU2NH0.SXX3SHiDK1fFcHsXAVrEDxU3HGvnyjbptj4Lswo-_I8',
  })
  public accessToken: string;

  public constructor(authToken: string) {
    this.accessToken = authToken;
  }
}

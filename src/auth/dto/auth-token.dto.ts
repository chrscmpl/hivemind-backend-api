import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDto {
  @ApiProperty({
    nullable: false,
    type: 'string',
    example: 'Bearer',
  })
  public tokenType: string = 'Bearer';

  @ApiProperty({
    nullable: false,
    type: 'string',
    description:
      'The JWT token\'s payload contains the claims iat, exp, and sub.<br/> The example token is encrypted with secret "EXAMPLE_SECRET"',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTczNDAxMTQ4NywiZXhwIjoxNzM0MDk3ODg3fQ.pvMW5W9AD2Glw16WrI4e_MIH9LlmxgewmPV-y6h-rMg',
  })
  public accessToken: string;

  public constructor(authToken: string) {
    this.accessToken = authToken;
  }
}

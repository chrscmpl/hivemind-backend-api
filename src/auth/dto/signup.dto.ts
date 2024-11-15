import { IsEmail, Length, Matches } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @Length(6, 20)
  username: string;

  @Matches(process.env.PASSWORD_REGEX)
  password: string;
}

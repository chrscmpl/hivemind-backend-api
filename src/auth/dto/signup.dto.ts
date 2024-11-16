import { IsEmail, Length, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @Length(6, 20)
  username: string;

  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^\w\s]).{8,32}$/)
  password: string;
}

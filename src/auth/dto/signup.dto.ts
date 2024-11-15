import { IsEmail, Length, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  email: string;

  @Length(6, 20)
  username: string;

  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,64}$/)
  password: string;
}

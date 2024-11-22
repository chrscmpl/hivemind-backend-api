import { IsOptional, Length, MaxLength } from 'class-validator';

export class CreatePostDto {
  @Length(5, 100)
  public title: string;

  @IsOptional()
  @MaxLength(1000)
  public content?: string;
}

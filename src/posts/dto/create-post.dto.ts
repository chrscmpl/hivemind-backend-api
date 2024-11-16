import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  public title: string;

  @IsNotEmpty()
  public content: string;
}

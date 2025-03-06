/* eslint-disable @typescript-eslint/no-unused-vars */
import { CommentEntity } from '../entities/comment.entity';

export enum CommentExcludeEnum {
  CONTENT = 'content',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

// needed for static type checking
function validatePostExcludeEnum(): void {
  const validatePostExcludeEnum: (keyof CommentEntity)[] =
    Object.values(CommentExcludeEnum);
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { PostEntity } from '../entities/post.entity';

export enum PostExcludeEnum {
  TITLE = 'title',
  CONTENT = 'content',
  UPVOTE_COUNT = 'upvoteCount',
  DOWNVOTE_COUNT = 'downvoteCount',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

// needed for static type checking
function validatePostExcludeEnum(): void {
  const validatePostExcludeEnum: (keyof PostEntity)[] =
    Object.values(PostExcludeEnum);
}

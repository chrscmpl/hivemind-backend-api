import { PostEntity } from '../entities/post.entity';

export const postExcludeValuesDto = PostEntity.FETCH_COLUMNS.filter(
  (column) => column !== 'id' && column !== 'userId',
);

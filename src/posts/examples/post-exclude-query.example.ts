import { PostEntity } from '../entities/post.entity';

export function getPostExcludeQueryExamples() {
  const examples: { [key: string]: object } = {};

  for (const column of PostEntity.FETCH_COLUMNS) {
    examples[column] = {
      summary: `Exclude ${column}`,
      description: `Excludes the ${column} field`,
      value: column,
    };
  }

  return {
    nothing: {
      summary: 'Default',
      description: 'Does not exclude any fields',
    },
    ...examples,
    all: {
      summary: 'Exclude all',
      description: 'Excludes all fields (why?)',
      value: PostEntity.FETCH_COLUMNS.join(','),
    },
  };
}

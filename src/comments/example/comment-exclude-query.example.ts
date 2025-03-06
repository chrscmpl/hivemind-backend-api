import { CommentExcludeEnum } from '../enum/comment-exclude.enum';

export function getCommentExcludeQueryExamples() {
  const commentExcludeEnumValues = Object.values(CommentExcludeEnum);
  const examples: { [key: string]: object } = {};

  for (const column of commentExcludeEnumValues) {
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
      value: commentExcludeEnumValues.join(','),
    },
  };
}

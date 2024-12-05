import { PostExcludeEnum } from '../enum/post-exclude.enum';

export function getPostExcludeQueryExamples() {
  const postExcludeEnumValues = Object.values(PostExcludeEnum);
  const examples: { [key: string]: object } = {};

  for (const column of postExcludeEnumValues) {
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
      value: postExcludeEnumValues.join(','),
    },
  };
}

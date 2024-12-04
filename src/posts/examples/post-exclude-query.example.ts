import { postExcludeValuesDto } from '../dto/post-exclude-values.dto';

export function getPostExcludeQueryExamples() {
  const examples: { [key: string]: object } = {};

  for (const column of postExcludeValuesDto) {
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
      value: postExcludeValuesDto.join(','),
    },
  };
}

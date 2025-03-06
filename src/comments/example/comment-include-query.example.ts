export function getCommentIncludeQueryExamples() {
  return {
    nothing: {
      summary: 'Default',
      description: 'Includes no additional fields',
    },
    user: {
      summary: 'Include user',
      description: "Includes data about the comment's author",
      value: 'user',
    },
  };
}

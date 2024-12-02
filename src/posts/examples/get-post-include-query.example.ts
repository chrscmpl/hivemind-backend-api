export function getGetPostIncludeQueryExamples() {
  return {
    nothing: {
      summary: 'Default',
      description: 'Includes no additional fields',
    },
    ownVote: {
      summary: 'Include own vote',
      description: "Includes the authenticated user's vote to the posts",
      value: 'ownVote',
    },
    user: {
      summary: 'Include user',
      description: 'Includes data about the creators of the posts',
      value: 'user',
    },
    all: {
      summary: 'Include all',
      description: 'Includes all additional fields',
      value: 'ownVote,user',
    },
  };
}

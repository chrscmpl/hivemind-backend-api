export function getPostsPaginationIncludeQueryExamples() {
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
    content: {
      summary: 'Include content',
      description: 'Includes the content of the posts',
      value: 'content',
    },
    user: {
      summary: 'Include user',
      description: 'Includes data about the creators of the posts',
      value: 'user',
    },
    all: {
      summary: 'Include all',
      description: 'Includes all additional fields',
      value: 'ownVote,content,user',
    },
  };
}

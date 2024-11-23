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
    all: {
      summary: 'Include all',
      description: 'Includes all additional fields',
      value: 'content,ownVote',
    },
  };
}

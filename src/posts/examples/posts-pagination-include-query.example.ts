export function getPostsPaginationIncludeQueryExamples() {
  return {
    nothing: {
      summary: 'Default',
      description: 'Includes no additional fields',
    },
    myVote: {
      summary: 'Include my vote',
      description: "Includes the authenticated user's vote to the posts",
      value: 'myVote',
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
      value: 'myVote,content,user',
    },
  };
}

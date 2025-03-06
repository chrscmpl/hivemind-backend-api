export function getPostIncludeQueryExamples() {
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
    user: {
      summary: 'Include user',
      description: "Includes data about the post's author",
      value: 'user',
    },
    all: {
      summary: 'Include all',
      description: 'Includes all additional fields',
      value: 'myVote,user',
    },
  };
}

export function getPostsPaginationIncludeQueryExamples() {
  return {
    nothing: {
      summary: 'Default',
      description: 'Includes no additional fields',
    },
    ownReaction: {
      summary: 'Include own reaction',
      description: "Includes the authenticated user's vote to the posts",
      value: 'ownReaction',
    },
    content: {
      summary: 'Include content',
      description: 'Includes the content of the posts',
      value: 'content',
    },
    all: {
      summary: 'Include all',
      description: 'Includes all additional fields',
      value: 'content,ownReaction',
    },
  };
}

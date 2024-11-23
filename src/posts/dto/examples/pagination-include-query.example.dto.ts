export function getPostsPaginationIncludeQueryExamples() {
  return {
    nothing: {
      summary: 'Default',
      description: 'Includes no additional fields',
    },
    ownReaction: {
      summary: 'Include own reaction',
      description: "Includes the authenticated user's vote to the post",
      value: 'ownReaction',
    },
    content: {
      summary: 'Include content',
      description: 'Includes the content of the post',
      value: 'content',
    },
    all: {
      summary: 'Include all',
      description: 'Includes all additional fields',
      value: 'content,ownReaction',
    },
  };
}

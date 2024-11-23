export function getPostIncludeQueryExamples() {
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
  };
}

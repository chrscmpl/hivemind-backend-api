export function getPostIncludeQueryExamples() {
  return {
    nothing: {
      summary: 'Default',
      description: 'Includes no additional fields',
    },
    ownVote: {
      summary: 'Include own vote',
      description: "Includes the authenticated user's vote to the post",
      value: 'ownVote',
    },
  };
}

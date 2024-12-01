export function getCreatedPostExample() {
  return {
    id: 1,
    title: 'My first post',
    content: 'This is my first post.',
    upvoteCount: 10,
    downvoteCount: 2,
    createdAt: '2024-12-12T12:00:00Z',
    updatedAt: '2024-12-13T18:30:00Z',
    user: {
      id: 1,
    },
  };
}

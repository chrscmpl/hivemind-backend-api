export function getAgeStringExamples() {
  return {
    '1 hour': {
      summary: 'Past hour',
      description: 'Includes posts from the past hour',
      value: '1h',
    },
    '1 day': {
      summary: 'Past day',
      description: 'Includes posts from the past day',
      value: '1d',
    },
    '1 week': {
      summary: 'Past week',
      description: 'Includes posts from the past 7 days',
      value: '7d',
    },
    '1 month': {
      summary: 'Past month',
      description: 'Includes posts from the past month',
      value: '1 month',
    },
    '1 year': {
      summary: 'Past year',
      description: 'Includes posts from the past year',
      value: '1y',
    },
    'Custom duration': {
      summary: 'Custom duration',
      description: 'Includes posts from a custom duration',
      value: '3w2d',
    },
    All: {
      summary: 'All posts',
      description: 'Includes all posts',
      value: 'all',
    },
  };
}

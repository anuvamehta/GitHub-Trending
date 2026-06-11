import { Repository } from '../app/core/models/repository.model';

export function makeRepo(overrides: Partial<Repository> = {}): Repository {
  return {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'A JavaScript library for building user interfaces.',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 1000,
    forks_count: 100,
    language: 'JavaScript',
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/facebook',
    },
    ...overrides,
  };
}

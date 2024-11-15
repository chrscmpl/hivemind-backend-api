import { AuthGuard } from '../guards/auth.guard';

describe('AutheGuard', () => {
  it('should be defined', () => {
    expect(new (AuthGuard())()).toBeDefined();
  });
});

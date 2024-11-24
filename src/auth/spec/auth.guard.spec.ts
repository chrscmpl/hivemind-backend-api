import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';

describe('OptionalAuthGuard', () => {
  it('should be defined', () => {
    expect(new OptionalAuthGuard()).toBeDefined();
  });
});

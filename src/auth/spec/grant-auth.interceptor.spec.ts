import { GrantAuthInterceptor } from '../interceptors/grant-auth.interceptor';

describe('GrantuthInterceptor', () => {
  it('should be defined', () => {
    expect(new GrantAuthInterceptor()).toBeDefined();
  });
});

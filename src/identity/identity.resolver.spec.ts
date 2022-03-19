import { Test, TestingModule } from '@nestjs/testing';
import { IdentityResolver } from './identity.resolver';
import { IdentityService } from './identity.service';

describe('IdentityResolver', () => {
  let resolver: IdentityResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdentityResolver, IdentityService],
    }).compile();

    resolver = module.get<IdentityResolver>(IdentityResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

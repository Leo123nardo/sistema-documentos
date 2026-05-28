import { Test, TestingModule } from '@nestjs/testing';
import { FuncionesPrincipalesService } from './funciones-principales.service';

describe('FuncionesPrincipalesService', () => {
  let service: FuncionesPrincipalesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FuncionesPrincipalesService],
    }).compile();

    service = module.get<FuncionesPrincipalesService>(FuncionesPrincipalesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ConocimientosService } from './conocimientos.service';

describe('ConocimientosService', () => {
  let service: ConocimientosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConocimientosService],
    }).compile();

    service = module.get<ConocimientosService>(ConocimientosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

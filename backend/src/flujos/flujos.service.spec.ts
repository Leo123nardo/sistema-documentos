import { Test, TestingModule } from '@nestjs/testing';
import { FlujosService } from './flujos.service';

describe('FlujosService', () => {
  let service: FlujosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlujosService],
    }).compile();

    service = module.get<FlujosService>(FlujosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

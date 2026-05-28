import { Test, TestingModule } from '@nestjs/testing';
import { RasgosPersonalidadService } from './rasgos-personalidad.service';

describe('RasgosPersonalidadService', () => {
  let service: RasgosPersonalidadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RasgosPersonalidadService],
    }).compile();

    service = module.get<RasgosPersonalidadService>(RasgosPersonalidadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

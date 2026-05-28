import { Test, TestingModule } from '@nestjs/testing';
import { EquiposMaquinariaService } from './equipos-maquinaria.service';

describe('EquiposMaquinariaService', () => {
  let service: EquiposMaquinariaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EquiposMaquinariaService],
    }).compile();

    service = module.get<EquiposMaquinariaService>(EquiposMaquinariaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

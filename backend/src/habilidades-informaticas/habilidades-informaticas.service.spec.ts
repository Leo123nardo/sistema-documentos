import { Test, TestingModule } from '@nestjs/testing';
import { HabilidadesInformaticasService } from './habilidades-informaticas.service';

describe('HabilidadesInformaticasService', () => {
  let service: HabilidadesInformaticasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabilidadesInformaticasService],
    }).compile();

    service = module.get<HabilidadesInformaticasService>(HabilidadesInformaticasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

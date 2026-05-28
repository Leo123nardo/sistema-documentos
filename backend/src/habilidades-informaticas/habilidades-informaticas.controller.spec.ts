import { Test, TestingModule } from '@nestjs/testing';
import { HabilidadesInformaticasController } from './habilidades-informaticas.controller';

describe('HabilidadesInformaticasController', () => {
  let controller: HabilidadesInformaticasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabilidadesInformaticasController],
    }).compile();

    controller = module.get<HabilidadesInformaticasController>(HabilidadesInformaticasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

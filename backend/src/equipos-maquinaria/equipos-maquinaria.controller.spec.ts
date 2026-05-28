import { Test, TestingModule } from '@nestjs/testing';
import { EquiposMaquinariaController } from './equipos-maquinaria.controller';

describe('EquiposMaquinariaController', () => {
  let controller: EquiposMaquinariaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquiposMaquinariaController],
    }).compile();

    controller = module.get<EquiposMaquinariaController>(EquiposMaquinariaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

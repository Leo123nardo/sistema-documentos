import { Test, TestingModule } from '@nestjs/testing';
import { RasgosPersonalidadController } from './rasgos-personalidad.controller';

describe('RasgosPersonalidadController', () => {
  let controller: RasgosPersonalidadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RasgosPersonalidadController],
    }).compile();

    controller = module.get<RasgosPersonalidadController>(RasgosPersonalidadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

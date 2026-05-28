import { Test, TestingModule } from '@nestjs/testing';
import { FuncionesPrincipalesController } from './funciones-principales.controller';

describe('FuncionesPrincipalesController', () => {
  let controller: FuncionesPrincipalesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuncionesPrincipalesController],
    }).compile();

    controller = module.get<FuncionesPrincipalesController>(FuncionesPrincipalesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

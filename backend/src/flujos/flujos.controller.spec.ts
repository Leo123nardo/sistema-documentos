import { Test, TestingModule } from '@nestjs/testing';
import { FlujosController } from './flujos.controller';

describe('FlujosController', () => {
  let controller: FlujosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlujosController],
    }).compile();

    controller = module.get<FlujosController>(FlujosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

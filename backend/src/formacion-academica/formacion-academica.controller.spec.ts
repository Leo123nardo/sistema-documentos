import { Test, TestingModule } from '@nestjs/testing';
import { FormacionAcademicaController } from './formacion-academica.controller';

describe('FormacionAcademicaController', () => {
  let controller: FormacionAcademicaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FormacionAcademicaController],
    }).compile();

    controller = module.get<FormacionAcademicaController>(FormacionAcademicaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

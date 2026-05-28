import { Test, TestingModule } from '@nestjs/testing';
import { FormacionAcademicaService } from './formacion-academica.service';

describe('FormacionAcademicaService', () => {
  let service: FormacionAcademicaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormacionAcademicaService],
    }).compile();

    service = module.get<FormacionAcademicaService>(FormacionAcademicaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

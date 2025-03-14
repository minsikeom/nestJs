import { Test, TestingModule } from '@nestjs/testing';
import { TronController } from './tron.controller';
import { TronService } from './tron.service';

describe('TronController', () => {
  let controller: TronController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TronController],
      providers: [TronService],
    }).compile();

    controller = module.get<TronController>(TronController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

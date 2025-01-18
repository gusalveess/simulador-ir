import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockReturnValue('Hello World!'),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  it('should return "Hello World!" from the service', () => {
    expect(appController.getHello()).toBe('Hello World!');
  });

  it('should call the service correctly', () => {
    const spy = jest.spyOn(appService, 'getHello');
    appController.getHello();
    expect(spy).toHaveBeenCalled();
  });
});
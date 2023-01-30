import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ParkingService } from './service/parking.service';
import { ParkingController } from './parking.controller';
import { Slot } from './model/slot';
import { Car } from './model/car';

const mockCar: Car = {
  licensePlate: 'car'
};

const mockSlot: Slot = {
  id: 0,
  isEmpty: false,
  carLicensePlate: 'car'
};

const mockVacatedSlot: Slot = {
  id: 0,
  isEmpty: true
};

const mockParkingService = jest.fn().mockReturnValue({
  parkCar: jest.fn((value) => value),
  unparkCar: jest.fn((value) => value),
  getSlotInfo: jest.fn((value) => value),
});

describe('ParkingController', () => {
  let controller: ParkingController;
  let service: ParkingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingController],
      providers: [
        {
          provide: ParkingService,
          useValue: mockParkingService()
        }
      ]
    }).compile();

    controller = module.get<ParkingController>(ParkingController);
    service = module.get<ParkingService>(ParkingService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should park car successfully', async() => {
    jest
      .spyOn(service, 'parkCar')
      .mockImplementation(() => Promise.resolve(mockSlot));
    const result = await controller.parkCar(mockCar);
    expect(service.parkCar).toBeCalledTimes(1);
    expect(result).toBe(mockSlot);
  });

  it('should park car not successfully', async() => {
    const mockStatusConflict = 409;
    jest
      .spyOn(service, 'parkCar')
      .mockRejectedValueOnce(new HttpException('Car is already parked!', HttpStatus.CONFLICT));
    const result = await controller.parkCar(mockCar);
    expect(service.parkCar).toBeCalledTimes(1);
    expect((result as HttpException).getStatus()).toBe(mockStatusConflict);
  });

  it('should unpark car successfully', async() => {
    jest
      .spyOn(service, 'unparkCar')
      .mockImplementation(() => Promise.resolve(mockVacatedSlot));
    const result = await controller.unparkCar(mockCar.licensePlate);
    expect(service.unparkCar).toBeCalledTimes(1);
    expect((result as Slot).isEmpty).toBeTruthy();
  });

  it('should unpark car not successfully', async() => {
    const mockStatusBadRequest = 400;
    jest
      .spyOn(service, 'unparkCar')
      .mockRejectedValueOnce(new HttpException('Car with such license plate is not parked!', HttpStatus.BAD_REQUEST));
    const result = (await controller.unparkCar(mockCar.licensePlate)) as HttpException;
    expect(service.unparkCar).toBeCalledTimes(1);
    expect(result.getStatus()).toBe(mockStatusBadRequest);
  });

  it('should get slot info successfully', async() => {
    const mockSlotId = 0;
    const mockCarLicensePlate = 'car';
    jest
      .spyOn(service, 'getSlotInfo')
      .mockImplementation(() => Promise.resolve(mockSlot));
    const result = await controller.getSlotInfo(mockSlotId);
    expect(service.getSlotInfo).toBeCalledTimes(1);
    expect((result as Slot).carLicensePlate).toBe(mockCarLicensePlate);
  });

  it('should get slot info not successfully', async() => {
    const mockSlotId = 8;
    const mockMessage = 'Slot with such ID does not exist!';
    jest
      .spyOn(service, 'getSlotInfo')
      .mockRejectedValueOnce(new HttpException('Slot with such ID does not exist!', HttpStatus.BAD_REQUEST));
    const result = (await controller.getSlotInfo(mockSlotId)) as HttpException;
    expect(service.getSlotInfo).toBeCalledTimes(1);
    expect((result.getResponse() as any).message).toBe(mockMessage);
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ParkingService } from './service/parking.service';
import { ParkingController } from './parking.controller';
import { Slot } from './model/slot';
import { CarDto } from './model/car.dto';

const mockCar: CarDto = {
  licensePlate: 'car'
};

const mockSlot: Slot = {
  id: 'slot1',
  isEmpty: false,
  carLicensePlate: 'car'
};

const mockVacatedSlot: Slot = {
  id: 'slot1',
  isEmpty: true
};

const mockParkingService = jest.fn().mockReturnValue({
  parkCar: jest.fn((value) => value),
  unparkCar: jest.fn((value) => value),
  getSlotDetails: jest.fn((value) => value),
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
    expect(result.data.carLicensePlate).toBe(mockCar.licensePlate);
  });

  it('should park car not successfully', async() => {
    jest
      .spyOn(service, 'parkCar')
      .mockRejectedValueOnce(new HttpException('Car is already parked!', HttpStatus.CONFLICT));
    expect(service.parkCar).toBeCalledTimes(0);
    try {
      await controller.parkCar(mockCar);
    } catch (error) {
      expect(error.message).toBe('Car is already parked!');
    }
  });

  it('should unpark car successfully', async() => {
    jest
      .spyOn(service, 'unparkCar')
      .mockImplementation(() => Promise.resolve(mockVacatedSlot));
    const result = await controller.unparkCar(mockCar.licensePlate);
    expect(service.unparkCar).toBeCalledTimes(1);
    expect(result.data.isEmpty).toBeTruthy();
  });

  it('should unpark car not successfully', async() => {
    jest
      .spyOn(service, 'unparkCar')
      .mockRejectedValueOnce(new HttpException('Car with such license plate is not parked!', HttpStatus.BAD_REQUEST));
    expect(service.unparkCar).toBeCalledTimes(0);
    try {
      await controller.unparkCar(mockCar.licensePlate);
    } catch (error) {
      expect(error.message).toBe('Car with such license plate is not parked!');
    }
  });

  it('should get slot info successfully', async() => {
    const mockCarLicensePlate = 'car';
    jest
      .spyOn(service, 'getSlotDetails')
      .mockImplementation(() => Promise.resolve(mockSlot));
    const result = await controller.getSlotDetails(mockSlot.id);
    expect(service.getSlotDetails).toBeCalledTimes(1);
    expect(result.data.carLicensePlate).toBe(mockCarLicensePlate);
  });

  it('should get slot info not successfully', async() => {
    jest
      .spyOn(service, 'getSlotDetails')
      .mockRejectedValueOnce(new HttpException('Slot with such ID does not exist!', HttpStatus.BAD_REQUEST));
    expect(service.getSlotDetails).toBeCalledTimes(0);
    try {
      await controller.getSlotDetails(mockSlot.id);
    } catch (error) {
      expect(error.message).toBe('Slot with such ID does not exist!');
    }
  });
});

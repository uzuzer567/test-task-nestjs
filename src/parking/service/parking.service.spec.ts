import { Test, TestingModule } from '@nestjs/testing';
import { ParkingService } from './parking.service';
import { ParkingRepository } from '../repository/parking.repository';
import { Slot } from '../model/slot';
import { CarDto } from '../model/car.dto';

const mockCar: CarDto = {
  licensePlate: 'car',
};

const mockSlot: Slot = {
  id: 'slot1',
  isEmpty: false,
  carLicensePlate: 'car',
};

const mockVacatedSlot: Slot = {
  id: 'slot1',
  isEmpty: true,
  lastCarLicensePlate: 'car',
};

const mockParkingRepository = jest.fn().mockReturnValue({
  parkCar: jest.fn((value) => value),
  unparkCar: jest.fn((value) => value),
  findCar: jest.fn((value) => value),
  findSlot: jest.fn((value) => value),
});

describe('ParkingService', () => {
  let service: ParkingService;
  let repository: ParkingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParkingService,
        {
          provide: ParkingRepository,
          useClass: mockParkingRepository,
        },
      ],
    }).compile();

    service = module.get<ParkingService>(ParkingService);
    repository = module.get<ParkingRepository>(ParkingRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should park car successfully', async () => {
    jest.spyOn(repository, 'findCar').mockImplementation(() => undefined);
    jest
      .spyOn(repository, 'parkCar')
      .mockImplementation(() => Promise.resolve(mockSlot));
    const result = await service.parkCar(mockCar);
    expect(result.carLicensePlate).toBe(mockCar.licensePlate);
  });

  it('should park car not successfully because the car is already parked', async () => {
    jest.spyOn(repository, 'findCar').mockImplementation(() => mockSlot);

    try {
      await service.parkCar(mockCar);
    } catch (error) {
      expect(error.message).toBe('Car is already parked!');
    }
  });

  it('should park car not successfully because the parking lot is full', async () => {
    jest.spyOn(repository, 'findCar').mockImplementation(() => undefined);
    jest.spyOn(repository, 'parkCar').mockImplementation(() => undefined);

    try {
      await service.parkCar(mockCar);
    } catch (error) {
      expect(error.message).toBe('Parking lot is full!');
    }
  });

  it('should unpark car successfully', async () => {
    jest
      .spyOn(repository, 'unparkCar')
      .mockImplementation(() => Promise.resolve(mockVacatedSlot));
    const result = await service.unparkCar(mockCar.licensePlate);
    expect(result.lastCarLicensePlate).toBe(mockCar.licensePlate);
  });

  it('should unpark car not successfully because the car was not found', async () => {
    jest.spyOn(repository, 'unparkCar').mockImplementation(() => undefined);
    try {
      await service.unparkCar(mockCar.licensePlate);
    } catch (error) {
      expect(error?.message).toBe('Car with such license plate is not parked!');
    }
  });

  it('should get slot details', async () => {
    jest
      .spyOn(repository, 'findSlot')
      .mockImplementation(() => Promise.resolve(mockSlot));
    const result = await service.getSlotDetails(mockSlot.id);
    expect(result.isEmpty).toBeFalsy();
  });

  it('should not find slot because slot with such ID was not found', async () => {
    jest.spyOn(repository, 'findSlot').mockImplementation(() => undefined);

    try {
      await service.getSlotDetails(mockVacatedSlot.id);
    } catch (error) {
      expect(error.message).toBe('Slot with such ID does not exist!');
    }
  });
});

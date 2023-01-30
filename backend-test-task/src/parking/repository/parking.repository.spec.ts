import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { ParkingRepository } from './parking.repository';
import { Slot } from '../model/slot';
import { Car } from '../model/car';

const mockCar: Car = {
    licensePlate: 'car'
  };

const mockSlot: Slot = {
    id: 0,
    isEmpty: false,
    carLicensePlate: 'car'
  };

describe('ParkingRepository', () => {
  let repository: ParkingRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        providers: [ParkingRepository, ConfigService]
    }).compile();

    repository = module.get<ParkingRepository>(ParkingRepository);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should get parking size', () => {
    const mockParkingSize = 5;
    expect(repository.parking.length).toBe(mockParkingSize);
  });

  it('should set parking slots', () => {
    const mockParkingSize = 1;
    repository.parking = [mockSlot];
    expect(repository.parking.length).toBe(mockParkingSize);
  });

  it('should find car', () => {
    const result = repository.findCar(mockCar);
    expect(result).toBeFalsy();
  });

  it('should park car', () => {
    const result = repository.parkCar(mockCar);
    expect(result.carLicensePlate).toBe(mockCar.licensePlate);
  });

  it('should unpark car', () => {
    repository.parkCar(mockCar);
    const result = repository.unparkCar(mockCar.licensePlate);
    expect(result.lastCarLicensePlate).toBe(mockCar.licensePlate);
  });

  it('should get slot info', () => {
    const result = repository.findSlot(mockSlot.id);
    expect(result.isEmpty).toBeTruthy();
  });
});

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Slot } from '../model/slot';
import { Car } from '../model/car';
import { ParkingRepository } from '../repository/parking.repository';

@Injectable()
export class ParkingService {
    constructor(private parkingRepository: ParkingRepository) { }

    async parkCar(car: Car) {
        const occupiedSlot: Slot = await this.parkingRepository.findCar(car);

        if (occupiedSlot) {
            throw new HttpException('Car is already parked!', HttpStatus.CONFLICT);
        }

        let selectedSlot: Slot = await this.parkingRepository.parkCar(car);
        if (!selectedSlot) {
            throw new HttpException('Parking lot is full!', HttpStatus.BAD_REQUEST);
        }
        return selectedSlot;
    }

    async unparkCar(licensePlate: string) {
        const vacatedSlot: Slot = await this.parkingRepository.unparkCar(licensePlate);
        if (!vacatedSlot?.id) {
            throw new HttpException('Car with such license plate is not parked!', HttpStatus.BAD_REQUEST);
        }
        return vacatedSlot;
    }

    async getSlotDetails(id: string) {
        const slotInfo = await this.parkingRepository.findSlot(id);

        if (!slotInfo) {
            throw new HttpException('Slot with such ID does not exist!', HttpStatus.BAD_REQUEST);
        }
        return slotInfo;
    }
}
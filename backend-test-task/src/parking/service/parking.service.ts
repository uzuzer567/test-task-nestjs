import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Slot } from '../model/slot';
import { Car } from '../model/car';
import { ParkingRepository } from '../repository/parking.repository';

@Injectable()
export class ParkingService {
    private parking: Slot[];
    constructor(private parkingRepository: ParkingRepository) {
        this.parking = this.parkingRepository.parking;
    }

    parkCar(car: Car): Slot {
        let selectedSlot: Slot = null;
        const isCarParked = this.parking.find((slot: Slot) => slot.carLicensePlate === car.licensePlate);

        if (isCarParked) {
            throw new HttpException('Car is already parked!', HttpStatus.CONFLICT);
        }

        this.parking = this.parking.map((slot) => {
            if (slot.isEmpty && !selectedSlot) {
                slot.carLicensePlate = car.licensePlate;
                slot.isEmpty = false;
                selectedSlot = slot;
            }
            return slot;
        });

        if (!selectedSlot) {
            throw new HttpException('Parking lot is full!', HttpStatus.BAD_REQUEST);
        }
        return selectedSlot;
    }

    unparkCar(licensePlate: string): Slot {
        let isCarParked = false;
        const vacatedSlot: Slot = {
            carLicensePlate: '',
            isEmpty: true,
            id: null,
        };

        this.parking = this.parking.map((slot: Slot) => {
            if (licensePlate == slot.carLicensePlate) {
                slot.isEmpty = true;
                vacatedSlot.carLicensePlate = slot.carLicensePlate;
                vacatedSlot.id = slot.id;
                delete slot.carLicensePlate;
                isCarParked = true;
            }
            return slot;
        });

        if (!isCarParked) {
            throw new HttpException('Car with such license plate is not parked!', HttpStatus.BAD_REQUEST);
        }
        return vacatedSlot;
    }

    getSlotInfo(slotId: number): Slot {
        let slot = this.parking.find((slot: Slot) => slot.id == slotId);

        if (!slot) {
            throw new HttpException('Slot with such ID does not exist!', HttpStatus.BAD_REQUEST);
        }
        return slot;
    }
}
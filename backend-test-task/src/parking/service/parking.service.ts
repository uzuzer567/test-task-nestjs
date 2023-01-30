import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { SlotDto } from '../dto/slot.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParkingService {
    private parking: SlotDto[] = [];
    constructor(private configService: ConfigService) {
        const parkingSize = this.configService.get('PARKING_SIZE');
        for (let index = 0; index < parkingSize; index++) {
            const slot = {
                id: index,
                isEmpty: true,
                carLicensePlate: '',
            }
            this.parking.push(slot);
        }
    }

    parkCar(licensePlate: string): SlotDto {
        let selectedSlot: SlotDto = null;
        const isCarParked = this.parking.filter((slot) => slot.carLicensePlate == licensePlate);

        if (isCarParked.length > 0) {
            throw new HttpException('Car is already parked!', HttpStatus.CONFLICT);
        }

        this.parking = this.parking.map((slot) => {
            if (slot.isEmpty && !selectedSlot) {
                slot.carLicensePlate = licensePlate;
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

    unparkCar(licensePlate: string): SlotDto {
        let isCarParked = false;
        const vacatedSlot: SlotDto = {
            carLicensePlate: '',
            isEmpty: true,
            id: null,
        };

        this.parking = this.parking.map((slot) => {
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

    getSlotInfo(slotId: number): SlotDto {
        let slot = this.parking.find(slot => slot.id == slotId);

        if (!slot) {
            throw new HttpException('Slot with such ID does not exist!', HttpStatus.BAD_REQUEST);
        }
        return slot;
    }
}
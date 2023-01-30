import { Injectable } from '@nestjs/common';
import { Slot } from '../model/slot';
import { Car } from '../model/car';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParkingRepository {
    private parkingSlots: Slot[] = [];
    
    constructor(private configService: ConfigService) {
        const parkingSize = this.configService.get('PARKING_SIZE') || 5;
        for (let index = 0; index < parkingSize; index++) {
            const slot = {
                id: index,
                isEmpty: true,
            }
            this.parkingSlots.push(slot);
        }
    }

    get parking(): Slot[] {
        return this.parkingSlots;
    }

    set parking(parking: Slot[]) {
        this.parkingSlots = parking;
    }

    findCar(car: Car): Slot {
        return this.parking.find((slot: Slot) => slot?.carLicensePlate === car.licensePlate);
    }

    parkCar(car: Car): Slot {
        let selectedSlot: Slot = null;
        this.parking = this.parking.map((slot) => {
            if (slot.isEmpty && !selectedSlot) {
                slot.carLicensePlate = car.licensePlate;
                slot.isEmpty = false;
                selectedSlot = slot;
            }
            return slot;
        });
        return selectedSlot;
    }

    unparkCar(licensePlate: string): Slot {
        const vacatedSlot: Slot = {
            lastCarLicensePlate: '',
            carLicensePlate: '',
            isEmpty: true,
            id: null,
        };
        this.parking = this.parking.map((slot: Slot) => {
            if (licensePlate == slot.carLicensePlate) {
                slot.isEmpty = true;
                slot.lastCarLicensePlate = slot.carLicensePlate;
                vacatedSlot.lastCarLicensePlate = slot.carLicensePlate;
                vacatedSlot.id = slot.id;
                delete slot.carLicensePlate;
            }
            return slot;
        });
        return vacatedSlot;
    }

    findSlot(slotId: number): Slot {
        return this.parking.find((slot: Slot) => slot.id === slotId);
    }
}
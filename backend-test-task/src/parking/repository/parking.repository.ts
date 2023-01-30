import { Injectable } from '@nestjs/common';
import { Slot } from '../model/slot';
import { Car } from '../model/car';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ParkingRepository {
    parkingSlots: Slot[] = [];
    
    constructor(private configService: ConfigService) {
        const parkingSize = this.configService.get('PARKING_SIZE') || 5;
        for (let index = 0; index < parkingSize; index++) {
            const slot = {
                id: 'slot' + index,
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

    findCar(car: Car): Slot | undefined {
        return this.parking.find((slot: Slot) => slot?.carLicensePlate === car.licensePlate);
    }

    async parkCar(car: Car): Promise<Slot | null> {
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

    async unparkCar(licensePlate: string): Promise<Slot> {
        const vacatedSlot: Slot = {
            lastCarLicensePlate: '',
            isEmpty: true,
            id: null,
        };
        this.parking = this.parking.map((slot: Slot) => {
            if (licensePlate === slot.carLicensePlate) {
                vacatedSlot.lastCarLicensePlate = slot.carLicensePlate;
                vacatedSlot.id = slot.id;
                slot.isEmpty = true;
                slot.lastCarLicensePlate = slot.carLicensePlate;
                delete slot.carLicensePlate;
            }
            return slot;
        });
        return vacatedSlot;
    }

    async findSlot(id: string): Promise<Slot | undefined> {
        return this.parking.find((slot: Slot) => slot.id == id);
    }
}
import { Injectable } from '@nestjs/common';
import { Slot } from '../model/slot';
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
}
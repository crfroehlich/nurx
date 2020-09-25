import * as faker from 'faker';
import { Inventory, Pharmacy } from './nurx_data_model';

const getRandomNumber = (): number => {
    const max = 100;
    const min = 1;
    return Math.floor(Math.random() * (max - min) + min);
}

const drugs: string[] = ['A', 'B', 'C', 'd', 'e', 'f'];

export const generateTestData = (): Pharmacy[] => {
    let id = 0;
    const response = [];
    for (let i: number = 0; i < 20; i += 1) {
        const pharm: Pharmacy = {
            id: i,
            name: faker.company.companyName(),
            inventory: []
        }
        for (let o: number = 0; o < 6; o += 1) {
            const item : Inventory = {
                id: o,
                drug: drugs[o],
                cost: getRandomNumber()
            };
            pharm.inventory.push(item);
        }
        response.push(pharm);
    }
    
    return response;
}
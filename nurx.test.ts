import * as faker from 'faker';
import { expect } from 'chai';
import { Inventory, Pharmacy } from './nurx_data_model';
import { Order } from './nurx_data_model';
import { Router } from './nurx_router';
import 'mocha';

// Get a random integer between 1 - 100
const getRandomNumber = (): number => {
    const max = 100;
    const min = 1;
    return Math.floor(Math.random() * (max - min) + min);
}

// Define some drug names to use for testing
const drugs: string[] = ['A', 'B', 'C', 'd', 'e', 'f'];

// Generate some test Pharmacies to use for testing
const generateTestData = (): Pharmacy[] => {
    const response = [];
    for (let i: number = 0; i < 20; i += 1) {
        const pharm: Pharmacy = {
            name: faker.company.companyName(),
            inventory: []
        }
        for (let o: number = 0; o < 6; o += 1) {
            const item : Inventory = {
                drug: drugs[o],
                cost: getRandomNumber()
            };
            pharm.inventory.push(item);
        }
        response.push(pharm);
    }
    return response;
}

// Populate the test pharmacies for the tests
const pharmacies = generateTestData();

// Instantiate the router
const router = new Router(pharmacies);

describe('Asserts that assignments are created correctly', () => {
  it('order with 3 items is assigned to pharmacies', () => {
    // We need the order instance first so we can assign it by reference
    const order: Order = { items: [] };
    order.items.push({ drug: 'A', order, quantity: 2 }, {drug: 'B', order, quantity: 17}, {drug: 'A', order, quantity: 2});
    const assignments = router.assign(order);
    const assignmentCount = assignments.reduce((accumulator, current) => accumulator += current.items.length, 0);
    expect(assignmentCount).to.equal(3);
  });

  it('order with 5 items is assigned to pharmacies', () => {
    // We need the order instance first so we can assign it by reference
    const order: Order = { items: [] };
    order.items.push({ drug: 'A', order, quantity: 2 }, {drug: 'B', order, quantity: 17}, {drug: 'C', order, quantity: 2 }, {drug: 'd', order, quantity: 7 }, {drug: 'e', order, quantity: 5 });
    const assignments = router.assign(order);
    const assignmentCount = assignments.reduce((accumulator, current) => accumulator += current.items.length, 0);
    expect(assignmentCount).to.equal(5);
  });
});

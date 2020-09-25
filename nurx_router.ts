import { Assignment, Order, OrderItem, Pharmacy } from './nurx_data_model';

/**
 * Basic routing class for placing orders and routing items to pharmacies
 */
export class Router {
  public readonly pharmacies: Pharmacy[];

  /**
   * Temporary constructor for use in testing. It's unlikely that we would need to know the pharmacies on construction,
   * as we would likely have a database connection and be able to assemble pharmacy data in a more optimal way.
   * @param pharmacies - For now, define pharmacies on construction
   */
  constructor(pharmacies: Pharmacy[]) {
    this.pharmacies = pharmacies;
  }

  /**
   * Returns a collection of assignments for a given order
   * @param order - Order to divide among pharmacies for cheapest total cost
   */
  public assign = (order: Order): Assignment[] => {
    let response: Assignment[] = [];
    // Temporary object for assigning order items to a pharmacy
    let fulfillment: any = {};
    // This approach assumes each order item will be for a unique drug, which will probably not be true.
    // While this will result pharmacies receiving multiple items for the same drug,
    // items with the same drug will only be assigned to a single pharmacy
    order.items.forEach((item: OrderItem) => {
      // Find the cheapest pharmacy for a drug
      let cheapestPharmacy = this.pharmacies
        // First, eliminate all pharmacies that do not have this drug
        .filter((pharm) =>
          pharm.inventory.some((i) => i.drug === item.drug))
        // Second, fetch the information we need specific to this item
        .map((pharm: Pharmacy) => {
          return { pharm: pharm, drug: pharm.inventory.find((i) => i.drug === item.drug) };
        })
        // Third, only consider the pharmacy with the cheapest cost for this drug
        .reduce((cheapest: any, current: any) => {
          if (cheapest && current && cheapest.drug.cost <= current.drug.cost) return cheapest;
          if (cheapest && current && cheapest.drug.cost >= current.drug.cost) return current;
        });

      // Populate our temporary pharmacy value if we have not already
      fulfillment[cheapestPharmacy.pharm.name] = fulfillment[cheapestPharmacy.pharm.name] || {
        orders: [],
        pharm: cheapestPharmacy.pharm,
      };
      // Assign this item
      fulfillment[cheapestPharmacy.pharm.name].orders.push(item);
      // Uncomment for debugging/sanity checks
      // console.log(`Drug: ${item.drug}; Pharm: ${cheapestPharmacy.pharm.name}; Cost: ${this.pharmacies.find(p => p.name === cheapestPharmacy.pharm.name)?.inventory.find(i => i.drug == item.drug)?.cost}`)
    });
    // This deconstructs the temporary fulfillment object into the expected response type
    // The logic for this should be refactored to eliminate the need to re-iterate over this;
    // but this approach is chosen here for readability/simplicity at the expense of performance.
    for (const val of Object.values(fulfillment) as any) {
      response.push({  pharmacy: { name: val.pharm.name, inventory: [] }, items: val.orders}  )
    }
    return response;
  }
}

/**
 * Placeholder for future functionality. It may be useful to implement an `id` property and implementation, for example, that all interfaces share for primary key generation.
 */
class BaseTable {

}

/**
 * Represents a pharmacy's inventory.
 * NOTE: this should probably be expanded to include quantity available
 * NOTE: validation should be added to ensure cost is greater than or equal to zero
 */
export interface Inventory extends BaseTable {
  cost: number;
  drug: string;
}

export interface Pharmacy extends BaseTable {
  inventory: Inventory[];
  name: string;
}

/**
 * Implementation of this should eventually handle assigning the Item to the order's items
 * NOTE: validation should be added to ensure quantity is an integer greater than zero
 */
export interface OrderItem extends BaseTable {
  drug: string;
  order: Order;
  quantity: number;
}

/**
 * Implementation should validate that assigned items match this order
 */
export interface Order extends BaseTable {
  items: OrderItem[];
}

export interface Assignment extends BaseTable {
  items: OrderItem[];
  pharmacy: Pharmacy;
}

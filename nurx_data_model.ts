interface BaseTable {
  id: number;
}
export interface Inventory extends BaseTable {
  cost: number;
  drug: string;
}

export interface Pharmacy extends BaseTable {
  inventory: Inventory[];
  name: string;
}

export interface OrderItem extends BaseTable {
  drug: string;
  order: Order;
  quantity: number;
}

export interface Order extends BaseTable {
  items: OrderItem[];
}

export interface Assignment extends BaseTable {
  items: OrderItem[];
  pharmacy: Pharmacy;
}

export class Router {
  public pharmacies: Pharmacy[];

  constructor() {
    this.pharmacies = [];
  }

  public assign = (order: Order): Assignment => {
    return { id: 0, items: [], pharmacy: { id: 0, inventory: [], name: 'foo' }};
  }
}

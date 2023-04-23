interface IWareHouse {
    add(product: string, quantity: number): void;
    hasInventory(product: string, quantity: number): boolean;
    remove(product: string, quantity: number): void;
  }
  
  interface IInventory {
    [index: string]: number;
  }
  
  interface IOrder {
    fill(warehouse: IWareHouse): IWareHouse;
    isFilled(): boolean;
  }
  
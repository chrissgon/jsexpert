class Order {
  #filled = false;
  #product = "";
  #quantity = 0;

  constructor(product, quantity) {
    this.#product = product;
    this.#quantity = quantity;
  }

  async fill(warehouse) {
    if (await warehouse.hasInventory(this.#product, this.#quantity)) {
      warehouse.remove(this.#product, this.#quantity);
      this.#filled = true;
    }

    return warehouse;
  }

  isFilled() {
    return this.#filled;
  }
}

module.exports = Order;

class WareHouse {
  #inventory = {};

  add(product, quantity) {
    this.#inventory[product] = (this.#inventory[product] || 0) + quantity;
    return this;
  }
  getAll() {
    return this.#inventory;
  }
  async hasInventory(product, quantity) {
    // simulate a longer api call
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return this.#inventory[product] >= quantity;
  }
  remove(product, quantity) {
    this.#inventory[product] -= quantity;
  }
}

module.exports = WareHouse;

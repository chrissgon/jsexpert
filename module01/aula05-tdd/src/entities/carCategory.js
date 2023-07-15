const Base = require("./base/base");

class CarCategory extends Base {
  constructor({ id, name, carIDs, price }) {
    super({ id, name });

    this.carIDs = carIDs;
    this.price = price;
  }
}

module.exports = CarCategory;

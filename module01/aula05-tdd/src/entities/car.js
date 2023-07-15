const Base = require("./base/base");

class Car extends Base {
  constructor({ id, name, releaseYear, available, hasGas }) {
    super({ id, name });

    this.releaseYear = releaseYear;
    this.available = available;
    this.hasGas = hasGas;
  }
}

module.exports = Car;

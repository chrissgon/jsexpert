const BaseRepo = require("../repositories/baseRepo");
const Tax = require("../entities/tax");
const Transaction = require("../entities/transaction");

class CarService {
  constructor({ cars }) {
    this.carRepo = new BaseRepo({ file: cars });

    this.taxesBasedOnAge = Tax.taxesBasedOnAge;
    this.currencyFormat = new Intl.NumberFormat("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  getRandomPositionFromArray(array) {
    return Math.floor(Math.random() * array.length);
  }

  chooseRandomCar(carCategory) {
    const randomCardIDIndex = this.getRandomPositionFromArray(
      carCategory.carIDs
    );
    return carCategory.carIDs[randomCardIDIndex];
  }

  async getAvailableCar(carCategory) {
    const carID = this.chooseRandomCar(carCategory);
    return await this.carRepo.find(carID);
  }

  calculateFinalPrice(customer, carCategory, numberOfDays) {
    const { age } = customer;
    const { price } = carCategory;
    const { then: tax } = this.taxesBasedOnAge.find(
      (tax) => age >= tax.from && age <= tax.to
    );

    const finalPrice = tax * price * numberOfDays;
    return this.currencyFormat.format(finalPrice);
  }

  async rent(customer, carCategory, numberOfDays) {
    const car = await this.getAvailableCar(carCategory);
    const amount = this.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    const today = new Date();
    today.setDate(today.getDate() + numberOfDays);

    const options = { year: "numeric", month: "long", day: "numeric" };
    const dueDate = today.toLocaleDateString("pt-br", options);

    return new Transaction({ customer, dueDate, car, amount });
  }
}

module.exports = CarService;

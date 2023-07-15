const { describe, it, before, beforeEach, afterEach } = require("mocha");
const { join } = require("path");
const { expect } = require("chai");
const sinon = require("sinon");

const CarService = require("../../src/service/carService");
const CarsDatabase = join(__dirname, "./../../database", "cars.json");

const Transaction = require("../../src/entities/transaction");

const mocks = {
  validCarCategory: require("../mocks/valid-carCategory.json"),
  validCar: require("../mocks/valid-car.json"),
  validCarCustomer: require("../mocks/valid-customer.json"),
};

describe("CarService Suite Tests", () => {
  let carService;
  let sandbox;

  before(() => {
    carService = new CarService({ cars: CarsDatabase });
  });
  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });
  afterEach(() => {
    sandbox.restore();
  });

  it("should retrieve a random position from an array", () => {
    const data = [0, 1, 2, 3, 4, 5];
    const have = carService.getRandomPositionFromArray(data);

    expect(have).to.be.lte(data.length).and.be.gte(0);
  });

  it("should choose the first id from cardIDs in carCategory", () => {
    const carCategory = mocks.validCarCategory;
    const carIDIndex = 0;

    sandbox
      .stub(carService, carService.getRandomPositionFromArray.name)
      .returns(carIDIndex);

    const expected = carCategory.carIDs[carIDIndex];
    const have = carService.chooseRandomCar(carCategory);

    expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok;
    expect(have).to.be.equal(expected);
  });

  it("given a carCategory it should return an available car", async () => {
    const car = mocks.validCar;
    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.carIDs = [car.id];

    sandbox
      .stub(carService.carRepo, carService.carRepo.find.name)
      .resolves(car);

    sandbox.spy(carService, carService.chooseRandomCar.name);

    const expected = car;
    const have = await carService.getAvailableCar(carCategory);

    expect(carService.chooseRandomCar.calledOnce).to.be.ok;
    expect(carService.carRepo.find.calledWithExactly(car.id)).to.be.ok;
    expect(have).to.be.deep.equal(expected);
  });

  it("given a carCategory, customer and numberOfDays it should calculate final amount in real", async () => {
    const customer = Object.create(mocks.validCarCustomer);
    customer.age = 50;

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;

    const numberOfDays = 5;

    sandbox
      .stub(carService, "taxesBasedOnAge")
      .value([{ from: 40, to: 50, then: 1.3 }]);

    const expected = carService.currencyFormat.format(244.4);
    const have = carService.calculateFinalPrice(
      customer,
      carCategory,
      numberOfDays
    );

    expect(have).to.be.deep.equal(expected);
  });

  it("given a customer and a carCategory it should return a transaction receipt", async () => {
    const car = mocks.validCar;

    const carCategory = Object.create(mocks.validCarCategory);
    carCategory.price = 37.6;
    carCategory.carIDs = [car.id];

    const customer = Object.create(mocks.validCarCustomer);
    customer.age = 20;

    const numberOfDays = 5;
    const dueDate = "10 de novembro de 2020";

    const now = new Date(2020, 10, 5);
    sandbox.useFakeTimers(now.getTime());

    const amount = carService.currencyFormat.format(206.8);

    sandbox
      .stub(carService.carRepo, carService.carRepo.find.name)
      .resolves(car);

    const expected = new Transaction({ customer, car, amount, dueDate });
    const have = await carService.rent(customer, carCategory, numberOfDays);

    expect(have).to.be.deep.equal(expected);

    console.log(have);
    // const today = new Date();
    // const options = { year: "numeric", month: "long", day: "numeric" };

    // console.log(today.toLocaleDateString("pt-br", options));
  });
});

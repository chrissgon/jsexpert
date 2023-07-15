const faker = require("faker");
const { join } = require("path");
const { writeFile } = require("fs/promises");

const Car = require("../src/entities/car");
const CarCategory = require("../src/entities/carCategory");
const Customer = require("../src/entities/customer");

const seederBaseFolder = join(__dirname, "../", "database");

const ITEMS_AMOUNT = 2;

const carCategory = new CarCategory({
  id: faker.random.uuid(),
  name: faker.vehicle.type(),
  carIDs: [],
  price: faker.finance.amount(20, 100),
});

const cars = [];
const customers = [];
for (let i = 0; i <= ITEMS_AMOUNT; i++) {
  const car = new Car({
    id: faker.random.uuid(),
    name: faker.vehicle.type(),
    available: true,
    hasGas: true,
    releaseYear: faker.date.past().getFullYear(),
  });

  carCategory.carIDs.push(car.id);
  cars.push(car);

  const customer = new Customer({
    id: faker.random.uuid(),
    name: faker.name.findName(),
    age: faker.random.number({ min: 18, max: 50 }),
  });

  customers.push(customer);
}

const write = (filename, data) =>
  writeFile(join(seederBaseFolder, filename), JSON.stringify(data));

(async () => {
  await write("cars.json", cars);
  await write("carCategories.json", [carCategory]);
  await write("customer.json", customers);
})();

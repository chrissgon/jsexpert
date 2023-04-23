const Order = require("../src/order");
const WareHouse = require("../src/warehouse");
const assert = require("assert");

const makeWareHouse = () => {
  return new WareHouse().add("JACK_DANIELS", 50);
};

(async () => {
  {
    const warehouse = new WareHouse();
    warehouse.add("JACK_DANIELS", 50);

    const expected = { JACK_DANIELS: 50 };
    const result = warehouse.getAll();

    assert.deepStrictEqual(result, expected);
  }

  {
    const warehouse = makeWareHouse();

    const order = new Order("JACK_DANIELS", 50);
    await order.fill(warehouse);

    const expected = true;
    const result = order.isFilled();

    assert.strictEqual(expected, result);
  }
})();

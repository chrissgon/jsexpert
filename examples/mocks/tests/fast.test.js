const Order = require("../src/order");
const WareHouse = require("../src/warehouse");
const assert = require("assert");

const { createSandbox } = require("sinon");
const sandbox = createSandbox();

const makeWareHouseMock = () => {
  const warehouse = new WareHouse();
  const warehouseMock = sandbox.mock(warehouse);
  const hasInventoryMock = warehouseMock.expects(warehouse.hasInventory.name);
  hasInventoryMock.resolves(true);
  return warehouse;
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
    const warehouse = makeWareHouseMock();
    const order = new Order("JACK_DANIELS", 50);
    await order.fill(warehouse);

    const expected = true;
    const result = order.isFilled();

    assert.strictEqual(expected, result);
  }
})();

const Fibonacci = require("./fibonacci");
const assert = require("assert");

const { createSandbox } = require("sinon");
const sandbox = createSandbox();

const fibonacci = new Fibonacci();

(async () => {
  const spy = sandbox.spy(fibonacci, fibonacci.execute.name);

  const values = [...fibonacci.execute(5)];

  {
    const expected = 6;
    const result = spy.callCount;

    assert.strictEqual(
      result,
      expected,
      `expected ${expected}, have ${result}`
    );
  }

  {
    const expected = [3, 1, 2];
    const result = spy.getCall(2).args;

    assert.deepStrictEqual(
      result,
      expected,
      `expected [${expected}], have [${result}]`
    );
  }

  {
    const expected = [0, 1, 1, 2, 3];
    const result = values;

    assert.deepStrictEqual(
      result,
      expected,
      `expected [${expected}], have [${result}]`
    );
  }
})();

const Service = require("./service");
const assert = require("assert");

const {
  BASE_URL_PLANET_TATOOINE,
  BASE_URL_PLANET_ALDERAAN,
} = require("./constants");

const aldenaraanStub = require("../mocks/alderaanStub.json");
const tatooineStub = require("../mocks/tatooineStub.json");

const { createSandbox } = require("sinon");
const sinon = createSandbox();

(async () => {
  const service = new Service();

  const stub = sinon.stub(service, service.makeRequest.name);
  stub.withArgs(BASE_URL_PLANET_ALDERAAN).resolves(aldenaraanStub);
  stub.withArgs(BASE_URL_PLANET_TATOOINE).resolves(tatooineStub);

  {
    const expected = {
      name: "Alderaan",
      climate: "temperate",
      appeardIn: 2,
    };

    const result = await service.getPlanets(BASE_URL_PLANET_ALDERAAN);
    assert.deepStrictEqual(result, expected);
  }
  {
    const expected = {
      name: "Tatooine",
      climate: "arid",
      appeardIn: 5,
    };

    const result = await service.getPlanets(BASE_URL_PLANET_TATOOINE);
    assert.deepStrictEqual(result, expected);
  }
})();

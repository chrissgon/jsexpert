const { error } = require("./src/constants");
const assert = require("assert");
const File = require("./src/file");

(async () => {
  {
    const filePath = "./mocks/invalid-empty.csv";
    const result = File.csvToJSON(filePath);
    const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    await assert.rejects(result, expected);
  }
  {
    const filePath = "./mocks/invalid-header.csv";
    const result = File.csvToJSON(filePath);
    const expected = new Error(error.FILE_HEADERS_ERROR_MESSAGE);
    await assert.rejects(result, expected);
  }
  {
    const filePath = "./mocks/invalid-longer.csv";
    const result = File.csvToJSON(filePath);
    const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    await assert.rejects(result, expected);
  }
  {
    const filePath = "./mocks/valid.csv";
    const result = await File.csvToJSON(filePath);
    const expected = [
      { id: "1", name: "chris", profession: "dev", age: "20" },
      { id: "2", name: "amanda", profession: "admin", age: "24" },
      { id: "3", name: "emilly", profession: "dentista", age: "25" },
    ];
    assert.deepEqual(result, expected);
  }
})();

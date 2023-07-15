const { readFile } = require("fs/promises");

class BaseRepo {
  constructor({ file }) {
    this.file = file;
  }

  async find(id) {
    const content = JSON.parse(await readFile(this.file));
    if (!id) return content;
    return content.find((item) => item.id === id);
  }
}

module.exports = BaseRepo;

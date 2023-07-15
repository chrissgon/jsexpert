import { readFile } from "fs/promises";

export default class BaseRepo {
  constructor({ file }) {
    this.load({ file });
  }

  async load({ file }) {
    this.database = JSON.parse(await readFile(file));
    if (!this.database) throw new Error("undefined database");
  }
}

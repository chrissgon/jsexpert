import BaseRepo from "./baseRepo";

export default class RoomRepo extends BaseRepo {
  constructor({ file }) {
    super({ file });
  }

  async find({ id }) {
    return this.database.find(({ roomID }) => roomID === id);
  }
}

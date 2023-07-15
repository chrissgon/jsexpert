import BaseRepo from "./baseRepo.js";

export default class ReserveRepo extends BaseRepo {
  constructor({ file }) {
    super({ file });
  }

  async find({ id }) {
    return this.database.find(({ reserveID }) => reserveID === id);
  }

  async findByRoomID({ roomID }) {
    const reserve = this.database.find((reserve) => reserve.roomID === roomID);
    reserve.start = new Date(reserve.start);
    reserve.end = new Date(reserve.end);
    return reserve;
  }

  async create(reserve) {
    this.database.push(reserve);
  }
  
  async delete(reserve) {
    const index = this.database.findIndex(
      ({ reserveID }) => reserveID === reserve.reserveID
    );

    if (index < 0) return;

    this.database.splice(index, 1);
  }
}

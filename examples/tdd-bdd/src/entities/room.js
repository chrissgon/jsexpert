export default class Room {
  constructor({ id = crypto.randomUUID(), name }) {
    this.roomID = id;
    this.name = name;
  }
}

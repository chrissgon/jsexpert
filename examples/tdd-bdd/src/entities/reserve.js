export default class Reserve {
  constructor({
    id = crypto.randomUUID(),
    roomID,
    collaboratorID,
    start,
    end,
  }) {
    this.reserveID = id;
    this.roomID = roomID;
    this.collaboratorID = collaboratorID;
    this.start = start;
    this.end = end;
  }
}

export default class ReserveService {
  constructor({ reserveRepo, collaboratorRepo }) {
    this.reserveRepo = reserveRepo;
    this.collaboratorRepo = collaboratorRepo;
  }

  collaboratorDoesNotHavePermission({ type }) {
    return type === "STUDENT";
  }

  minimumAdvanceHoursToBookExceeded({ start }) {
    const hours = Math.abs(new Date() - start) / 36e5;
    return hours <= 48;
  }

  async roomIsAvailable({ roomID, start }) {
    const { end } = await this.reserveRepo.findByRoomID({ roomID });
    return end < start;
  }

  isValid({ reserveID, roomID, collaboratorID, start, end }) {
    if (!reserveID) throw new Error("invalid reserveID");
    if (!roomID) throw new Error("invalid reserveID");
    if (!collaboratorID) throw new Error("invalid collaboratorID");

    if (!(start instanceof Date)) throw new Error("start should be Date");
    if (!(end instanceof Date)) throw new Error("end should be Date");

    const period = Math.ceil(Math.abs(end - start) / 864e5);
    if (period > 14) throw new Error("booking period exceeded");

    if (end < start) throw new Error("start must not be shorter than end");

    return true;
  }

  async book(reserve) {
    const { roomID, collaboratorID, start } = reserve;

    const collaborator = await this.collaboratorRepo.find({
      id: collaboratorID,
    });

    if (!collaborator) {
      throw new Error("not found collaborator");
    }
    if (this.collaboratorDoesNotHavePermission(collaborator)) {
      throw new Error("collaborator does not have permission");
    }
    if (this.minimumAdvanceHoursToBookExceeded({ start })) {
      throw new Error("advance hours exceeded");
    }
    if (!(await this.roomIsAvailable({ roomID, start }))) {
      throw new Error("room is unavailable");
    }

    try {
      !this.isValid(reserve);
    } catch (e) {
      throw e;
    }

    await this.reserveRepo.create(reserve);

    return true;
  }

  minimumAdvanceHoursToCancelExceeded({ start }) {
    const hours = Math.abs(new Date() - start) / 36e5;
    return hours <= 24;
  }

  async cancel(reserve) {
    const { reserveID, start } = reserve;

    if (this.minimumAdvanceHoursToCancelExceeded({ start })) {
      throw new Error("advance hours exceeded");
    }

    await this.reserveRepo.delete(reserveID);

    return true;
  }
}

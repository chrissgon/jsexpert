import * as url from "url";
import { describe, it, before, beforeEach, afterEach } from "mocha";
import { expect } from "chai";
import { createSandbox } from "sinon";
import { join } from "path";

import ReserveService from "../src/services/reserveService.js";
import ReserveRepo from "../src/repositories/reserveRepo.js";
import CollaboratorRepo from "../src/repositories/collaboratorRepo.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const ReservesDatabase = join(__dirname, "./../database/", "reserves.json");
const CollaboratorsDatabase = join(
  __dirname,
  "./../database/",
  "collaborators.json"
);

import invalidReserveReserveID from "./mocks/invalid-reserve-reserveID.json" assert { type: "json" };
import invalidReserveRoomID from "./mocks/invalid-reserve-roomID.json" assert { type: "json" };
import invalidReserveCollaboratorID from "./mocks/invalid-reserve-collaboratorID.json" assert { type: "json" };
import invalidReserveStart from "./mocks/invalid-reserve-start.json" assert { type: "json" };
import invalidReserveEnd from "./mocks/invalid-reserve-end.json" assert { type: "json" };
import invalidReserveDate from "./mocks/invalid-reserve-date.json" assert { type: "json" };
import validReserve from "./mocks/valid-reserve.json" assert { type: "json" };
import validStudent from "./mocks/valid-student.json" assert { type: "json" };
import validTeacher from "./mocks/valid-teacher.json" assert { type: "json" };
import validCoordinator from "./mocks/valid-coordinator.json" assert { type: "json" };

const mocks = {
  invalidReserveReserveID,
  invalidReserveRoomID,
  invalidReserveCollaboratorID,
  invalidReserveStart,
  invalidReserveEnd,
  invalidReserveDate,
  validReserve,
  validStudent,
  validTeacher,
  validCoordinator,
};

describe("Reserve Suite Tests", () => {
  let reserveService;
  let sandbox;

  before(() => {
    reserveService = new ReserveService({
      reserveRepo: new ReserveRepo({ file: ReservesDatabase }),
      collaboratorRepo: new CollaboratorRepo({ file: CollaboratorsDatabase }),
    });
  });

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("Should be false because the coordinator has permission", () => {
    const have = reserveService.collaboratorDoesNotHavePermission(
      mocks.validCoordinator
    );

    expect(have).to.be.false;
  });
  it("Should be false because the professor has permission", () => {
    const have = reserveService.collaboratorDoesNotHavePermission(
      mocks.validTeacher
    );

    expect(have).to.be.false;
  });
  it("Should be true because the student does not have permission", () => {
    const have = reserveService.collaboratorDoesNotHavePermission(
      mocks.validStudent
    );

    expect(have).to.be.true;
  });
  it("Should be false because not exceeded 48 hours in advance to book", () => {
    const start = new Date().setDate(new Date().getDate() + 3);
    const have = reserveService.minimumAdvanceHoursToBookExceeded({ start });
    expect(have).to.be.false;
  });
  it("Should be true because exceeded 48 hours in advance to book", () => {
    const start = new Date().setDate(new Date().getDate() + 1);
    const have = reserveService.minimumAdvanceHoursToBookExceeded({ start });
    expect(have).to.be.true;
  });
  it("Should be true because the room is available", async () => {
    const reserve = Object.create(mocks.validReserve);

    reserve.start = new Date(reserve.start);
    reserve.end = new Date(reserve.end);

    const endBeforeStart = new Date().setDate(reserve.start.getDate() - 2);

    sandbox
      .stub(
        reserveService.reserveRepo,
        reserveService.reserveRepo.findByRoomID.name
      )
      .resolves({ end: endBeforeStart });

    const have = await reserveService.roomIsAvailable(reserve);
    expect(have).to.be.true;
  });
  it("Should be false because the room is unavailable", async () => {
    const reserve = Object.create(mocks.validReserve);

    reserve.start = new Date(reserve.start);
    reserve.end = new Date(reserve.end);

    sandbox
      .stub(
        reserveService.reserveRepo,
        reserveService.reserveRepo.findByRoomID.name
      )
      .resolves(reserve);

    const have = await reserveService.roomIsAvailable(reserve);
    expect(have).to.be.false;
  });
  it("Should be true because the reserve is valid", () => {
    const reserve = Object.create(mocks.validReserve);

    reserve.start = new Date(reserve.start);
    reserve.end = new Date(reserve.end);

    const have = reserveService.isValid(reserve);
    expect(have).to.be.true;
  });
  it("Should return error because the reserve is invalid", () => {
    expect(() => {
      reserveService.isValid(mocks.invalidReserveReserveID);
    }).to.throw();

    expect(() => {
      reserveService.isValid(mocks.invalidReserveRoomID);
    }).to.throw();

    expect(() => {
      reserveService.isValid(mocks.invalidReserveCollaboratorID);
    }).to.throw();

    expect(() => {
      reserveService.isValid(mocks.invalidReserveStart);
    }).to.throw();

    expect(() => {
      const reserve = Object.create(mocks.invalidReserveEnd);
      reserve.start = new Date(reserve.start);
      reserveService.isValid(reserve);
    }).to.throw();

    expect(() => {
      const reserve = Object.create(mocks.validReserve);

      const start = new Date().setDate(new Date().getDate());
      const end = new Date().setDate(new Date().getDate() + 16);

      reserve.start = new Date(start);
      reserve.end = new Date(end);

      reserveService.isValid(reserve);
    }).to.throw();

    expect(() => {
      const reserve = Object.create(mocks.invalidReserveDate);

      reserve.start = new Date(reserve.start);
      reserve.end = new Date(reserve.end);

      reserveService.isValid(reserve);
    }).to.throw();
  });

  it("Should return error because the collaborator does not found to book", async () => {
    let err;

    sandbox
      .stub(
        reserveService.collaboratorRepo,
        reserveService.collaboratorRepo.find.name
      )
      .resolves(null);

    try {
      await reserveService.book(mocks.validReserve);
    } catch (e) {
      err = e;
    }

    expect(err).to.be.instanceof(Error);
  });
  it("Should return error because the collaborator does not have permission to book", async () => {
    let err;
    const collaborator = Object.create(mocks.validStudent);

    sandbox
      .stub(
        reserveService.collaboratorRepo,
        reserveService.collaboratorRepo.find.name
      )
      .resolves(collaborator);

    try {
      await reserveService.book(mocks.validReserve);
    } catch (e) {
      err = e;
    }

    expect(err).to.be.instanceof(Error);
  });
  it("Should return error because the advance hours is exceeded to book", async () => {
    let err;
    const reserve = Object.create(mocks.validReserve);
    const collaborator = Object.create(mocks.validCoordinator);

    const start = new Date().setDate(new Date().getDate() + 1);
    reserve.start = new Date(start);

    sandbox
      .stub(
        reserveService.collaboratorRepo,
        reserveService.collaboratorRepo.find.name
      )
      .resolves(collaborator);

    try {
      await reserveService.book(reserve);
    } catch (e) {
      err = e;
    }

    expect(err).to.be.instanceof(Error);
  });
  it("Should return error because the room is unavailable to book", async () => {
    let err;
    const reserve = Object.create(mocks.validReserve);
    const collaborator = Object.create(mocks.validCoordinator);

    const start = new Date().setDate(new Date().getDate() + 3);
    reserve.start = new Date(start);

    sandbox
      .stub(
        reserveService.collaboratorRepo,
        reserveService.collaboratorRepo.find.name
      )
      .resolves(collaborator);

    sandbox
      .stub(reserveService, reserveService.roomIsAvailable.name)
      .resolves(false);

    try {
      await reserveService.book(reserve);
    } catch (e) {
      err = e;
    }

    expect(err).to.be.instanceof(Error);
  });
  it("Should return error because the reserve is invalid to book", async () => {
    let err;
    const reserve = Object.create(mocks.validReserve);
    const collaborator = Object.create(mocks.validCoordinator);

    const start = new Date().setDate(new Date().getDate() + 3);
    reserve.start = new Date(start);

    sandbox
      .stub(
        reserveService.collaboratorRepo,
        reserveService.collaboratorRepo.find.name
      )
      .resolves(collaborator);

    sandbox
      .stub(reserveService, reserveService.roomIsAvailable.name)
      .resolves(true);

    try {
      await reserveService.book(reserve);
    } catch (e) {
      err = e;
    }

    expect(err).to.be.instanceof(Error);
  });
  it("Should to book and returns true", async () => {
    const reserve = Object.create(mocks.validReserve);
    const collaborator = Object.create(mocks.validCoordinator);

    const start = new Date().setDate(new Date().getDate() + 3);
    const end = new Date().setDate(new Date().getDate() + 10);

    reserve.start = new Date(start);
    reserve.end = new Date(end);

    sandbox
      .stub(
        reserveService.collaboratorRepo,
        reserveService.collaboratorRepo.find.name
      )
      .resolves(collaborator);

    sandbox
      .stub(reserveService, reserveService.roomIsAvailable.name)
      .resolves(true);

    sandbox
      .stub(reserveService.reserveRepo, reserveService.reserveRepo.create.name)
      .resolves(true);

    const have = await reserveService.book(reserve);
    expect(have).to.be.true;
  });
  it("Should be false because not exceeded 24 hours in advance to cancel", () => {
    const start = new Date().setDate(new Date().getDate() + 2);
    const have = reserveService.minimumAdvanceHoursToCancelExceeded({ start });
    expect(have).to.be.false;
  });
  it("Should be true because exceeded 24 hours in advance to cancel", () => {
    const start = new Date();
    const have = reserveService.minimumAdvanceHoursToCancelExceeded({ start });
    expect(have).to.be.true;
  });
  it("Should return error because the advance hours is exceeded to cancel", async () => {
    let err;
    const reserve = Object.create(mocks.validReserve);

    reserve.start = new Date();

    try {
      await reserveService.cancel(reserve);
    } catch (e) {
      err = e;
    }

    expect(err).to.be.instanceOf(Error);
  });
  it("Should to cancel and returns true", async () => {
    const reserve = Object.create(mocks.validReserve);

    const start = new Date().setDate(new Date().getDate() + 3);
    reserve.start = new Date(start);

    sandbox
      .stub(reserveService.reserveRepo, reserveService.reserveRepo.delete.name)
      .resolves(true);

    const have = await reserveService.cancel(reserve);
    expect(have).to.be.true;
  });
});

import BaseRepo from "./baseRepo.js";

export default class CollaboratorRepo extends BaseRepo {
  constructor({ file }) {
    super({ file });
  }

  async find({ id }) {
    return this.database.find(({ collaboratorID }) => collaboratorID === id);
  }
}

export default class Collaborator {
  constructor({ id = crypto.randomUUID(), name, type }) {
    this.collaboratorID = id;
    this.name = name;
    this.type = type;
  }
}

import * as url from "url";
import { faker } from "@faker-js/faker";
import { join } from "path";
import { writeFile } from "fs/promises";
import Room from "../src/entities/room.js";
import Collaborator from "../src/entities/collaborator.js";
import Reserve from "../src/entities/reserve.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const seederBaseFolder = join(__dirname, "../", "database");

const profiles = ["COORDINATOR", "TEACHER", "STUDENT"];

const collaborators = [];
for (const profile of profiles) {
  collaborators.push(
    new Collaborator({
      type: profile,
      name: faker.person.fullName(),
    })
  );
}

const rooms = [];
for (const i of [3, 9, 15, 26, 37]) {
  rooms.push(new Room({ name: `A0S${i}` }));
}

const now = new Date();

const reserves = [
  new Reserve({
    roomID: rooms[0].roomID,
    collaboratorID: collaborators[0].collaboratorID,
    start: now,
    end: faker.date.soon({ days: 2, refDate: now }),
  }),
  new Reserve({
    roomID: rooms[1].roomID,
    collaboratorID: collaborators[1].collaboratorID,
    start: now,
    end: faker.date.soon({ days: 2, refDate: now }),
  }),
];

const write = (filename, data) =>
  writeFile(join(seederBaseFolder, filename), JSON.stringify(data));

(async () => {
  await write("collaborators.json", collaborators);
  await write("rooms.json", rooms);
  await write("reserves.json", reserves);
})();

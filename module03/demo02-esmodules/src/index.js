import database from "../database.json";
import Person from "./person";
import { save } from "./repository";
import TerminalController from "./terminalController";

const DEFAULT_LANG = "pt-BR";
const STOP_TERM = ":q";

const terminalController = new TerminalController();
terminalController.initializeTerminal(database, DEFAULT_LANG);

async function mainLoop() {
  try {
    const answer = await terminalController.question();

    if (answer === STOP_TERM) {
      terminalController.closeTerminal();
      console.log("process finished");
      return;
    }

    const person = Person.generateInstanceFromString(answer);
    terminalController.updateTable(person.formatted(DEFAULT_LANG));
    await save(person)
    return mainLoop();
  } catch (err) {
    console.error(err);
    return mainLoop();
  }
}

await mainLoop();
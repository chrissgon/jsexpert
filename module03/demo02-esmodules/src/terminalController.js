import draftlog from "draftlog";
import chalk from "chalk";
import chalktable from "chalk-table";
import readline from "readline";
import Person from "./person";

export default class TerminalController {
  constructor() {
    this.print = {};
  }

  initializeTerminal(database, lang) {
    draftlog(console).addLineListener(process.stdin);
    this.terminal = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.initializeTable(database, lang);
  }

  initializeTable(database, lang) {
    this.data = database.map((item) => new Person(item).formatted(lang));

    const table = chalktable(this.getTableOptions(), this.data);
    this.print = console.draft(table);
  }

  closeTerminal() {
    this.terminal.close();
  }

  updateTable(item) {
    this.data.push(item);
    this.print(chalktable(this.getTableOptions(), this.data));
  }

  question(msg = "") {
    return new Promise((resolve) => this.terminal.question(msg, resolve));
  }

  getTableOptions() {
    return {
      leftPad: 2,
      columns: [
        { field: "id", name: chalk.cyan("ID") },
        { field: "vehicles", name: chalk.magenta("Vehicles") },
        { field: "kmTraveled", name: chalk.cyan("Km Traveled") },
        { field: "from", name: chalk.cyan("From") },
        { field: "to", name: chalk.cyan("To") },
      ],
    };
  }
}

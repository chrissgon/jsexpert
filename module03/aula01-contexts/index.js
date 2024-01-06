"use strict";

// import {readFile} from "fs/promises"
const {
  watch,
  promises: { readFile },
} = require("fs");

class File {
  watch(event, filename) {
    console.log(this);
    console.log(arguments);
    this.showContent(filename);
  }

  async showContent(filename) {
    console.log((await readFile(filename)).toString());
  }
}

const file = new File();

// array function
// watch(__filename, (event, filename) => file.watch(event, filename));

// bind
watch(__filename, file.watch.bind(file));

// call
// file.watch.call(
//   { showContent: () => console.log("mock showContent function") },
//   null,
//   __filename
// );

// apply
// file.watch.apply(
//   { showContent: () => console.log("mock showContent function") },
//   [null, __filename]
// );

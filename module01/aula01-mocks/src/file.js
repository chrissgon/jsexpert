const { readFile } = require("fs/promises");
const { error } = require("./constants");

const DEFAULT_OPTIONS = {
  maxLines: 3,
  header: ["id", "name", "profession", "age"],
};

class File {
  static async csvToJSON(filePath) {
    const content = await readFile(filePath, "utf8");
    this.isValid(content);
    return this.parseCSVToJSON(content);
  }

  static isValid(content, { maxLines, header } = DEFAULT_OPTIONS) {
    const [headerStr, ...body] = content.split(/\r?\n/);

    const isInvalidHeader = headerStr !== header.join(",");

    if (isInvalidHeader) {
      throw new Error(error.FILE_HEADERS_ERROR_MESSAGE);
    }

    if (!body.length || body.length > maxLines) {
      throw new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    }
  }

  static parseCSVToJSON(content) {
    const [_, ...body] = content.split(/\r?\n/);

    const users = [];

    for (const line of body) {
      const [id, name, profession, age] = line.split(",");

      users.push({
        id,
        name,
        profession,
        age,
      });
    }

    return users;
  }
}

module.exports = File;

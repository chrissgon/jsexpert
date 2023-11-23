import { describe, test, expect } from "bun:test";
import Person from "../src/person";

describe("Person", () => {
  test("should return a person instance from a string", () => {
    const person = Person.generateInstanceFromString(
      "1 Bike,Car 2000 2020-01-01 2022-01-01"
    );

    expect(person).toEqual({
      id: "1",
      vehicles: ["Bike", "Car"],
      kmTraveled: "2000",
      from: "2020-01-01",
      to: "2022-01-01",
    });
  });

  test("should format values", () => {
    const person = new Person({
      id: "1",
      vehicles: ["Bike", "Car"],
      kmTraveled: "2000",
      from: "2020-01-01",
      to: "2022-01-01",
    });
    const result = person.formatted("pt-BR");
    const expected = {
      id: 1,
      vehicles: "Bike e Car",
      kmTraveled: "2.000 km",
      from: "01 de janeiro de 2020",
      to: "01 de janeiro de 2022",
    };

    expect(result).toEqual(expected);
  });
});

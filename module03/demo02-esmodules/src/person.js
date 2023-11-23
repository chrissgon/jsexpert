export default class Person {
  constructor({ id, vehicles, kmTraveled, from, to }) {
    this.id = id;
    this.vehicles = vehicles;
    this.kmTraveled = kmTraveled;
    this.from = from;
    this.to = to;
  }

  formatted(lang) {
    function treatDate(date) {
      const [year, month, day] = date.split("-").map(Number);
      // months in JS starting in 0
      return new Date(year, month - 1, day);
    }

    return {
      id: Number(this.id),
      vehicles: new Intl.ListFormat(lang, {
        style: "long",
        type: "conjunction",
      }).format(this.vehicles),
      kmTraveled: new Intl.NumberFormat(lang, {
        style: "unit",
        unit: "kilometer",
      }).format(this.kmTraveled),
      from: new Intl.DateTimeFormat(lang, {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(treatDate(this.from)),
      to: new Intl.DateTimeFormat(lang, {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(treatDate(this.to)),
    };
  }

  static generateInstanceFromString(text) {
    const SPLIT_SEPARATOR = " ";
    const [id, vehicles, kmTraveled, from, to] = text.split(SPLIT_SEPARATOR);
    return new Person({
      id,
      vehicles: vehicles.split(","),
      kmTraveled,
      from,
      to,
    });
  }
}

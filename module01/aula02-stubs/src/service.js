class Service {
  async makeRequest(url) {
    return (await fetch(url)).json();
  }

  async getPlanets(url) {
    const { name, climate, films } = await this.makeRequest(url);
    const appeardIn = films.length;
    return { name, climate, appeardIn };
  }
}

module.exports = Service;

import agent from './agent';

class PlaceSource {
  create(gPlace) {
    gPlace.lat = gPlace.geometry.location.lat();
    gPlace.lon = gPlace.geometry.location.lng();
    return agent.post('/places', gPlace)
      .then(res => res.body);
  }
}

module.exports = new PlaceSource()

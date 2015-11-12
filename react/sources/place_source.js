import agent from './agent';

class PlaceSource {
  create(gPlace) {
    console.log('gPlace', gPlace.geometry);
    if(gPlace.geometry) {
      if(gPlace.geometry.location) {
        gPlace.lat = gPlace.geometry.location.lat();
        gPlace.lon = gPlace.geometry.location.lng();
      }
      if(gPlace.geometry.viewport) {
        gPlace.viewport_lat_north = gPlace.geometry.viewport.getNorthEast().lat();
        gPlace.viewport_lat_south = gPlace.geometry.viewport.getSouthWest().lat();
        gPlace.viewport_lon_east = gPlace.geometry.viewport.getNorthEast().lng();
        gPlace.viewport_lon_west = gPlace.geometry.viewport.getSouthWest().lng();
      }
    }
    return agent.post('/places', gPlace)
      .then(res => res.body);
  }
}

module.exports = new PlaceSource()

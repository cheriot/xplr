import _ from 'lodash';
import geolib from 'geolib';

// Geolib operates on {latitude, longitude} objects.
const wrapPlace = place => {
  return {
    latitude: place.get('lat'),
    longitude: place.get('lon'),
  }
}

export function orderByDistance(originPlace, places) {
  const orderedCoordinates = geolib.orderByDistance(
    wrapPlace(originPlace),
    places.map(wrapPlace)
  );
  return orderedCoordinates.map(c => {
    return _.assign(places[c.key], {distance: c.distance});
  });
}

export default {
  orderByDistance: orderByDistance
}

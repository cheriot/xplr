import Place from '../models/place';

class PlaceResource {

  static updateOrCreate(googlePlace) {
    const forged = Place.forge({google_place_id: googlePlace.id});
    return forged
      .fetch()
      .then(place => place || forged)
      .then(place => {
        place.updateFromGooglePlace(googlePlace);
        return place.save();
      })
      .catch((message) => console.log('error', message) );
  }

}

module.exports = PlaceResource

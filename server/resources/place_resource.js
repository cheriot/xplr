import Place from '../models/place';

class PlaceResource {

  static fetch(id) {
    return Place.forge({id: id}).fetch();
  }

  static updateOrCreate(gPlace) {
    const forged = Place.forge({google_place_id: gPlace.id});
    return forged
      .fetch()
      .then(place => place || forged)
      .then(place => {
        place.updateFromGooglePlace(gPlace);
        return place.save();
      })
      .catch((message) => console.log('error', message) );
  }

}

module.exports = PlaceResource

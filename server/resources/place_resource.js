import _ from 'lodash';
import googleAPI from '../models/google_api';
import Place from '../models/place';

class PlaceResource {

  static fetch(id) {
    return Place.forge({id: id}).fetch();
  }

  static fetchOrForge(gPlace) {
    if(_.isEmpty(gPlace.place_id)) throw new Error('No place_id');
    const forged = Place.forge({google_place_id: gPlace.place_id});
    return forged
      .fetch()
      .then(place => place || forged);
  }

  static updateOrCreate(gPlace) {
    return this.fetchOrForge(gPlace)
      .then(place => {
        place.updateFromGooglePlace(gPlace);

        if (gPlace.types.indexOf('continent') > -1) {
          // It's a contenint so no country to assign.
          return place;
        } else if (!place.get('country_id')) {
          return this.assignCountry(place, gPlace);
        } else {
          return place;
        }

      })
      .then(place => place.save())
      .catch((message, b, c) => console.log('error', message, b, c) );
  }

  static nearByPlace(place) {
    return this.nearBy(this.bounds(place))
      .then(collection => {
        return _.filter(collection.models, found => found.id != place.id);
      });
  }

  static nearBy(bounds) {
    return Place
      .where('lat', '<', bounds.viewport_lat_north)
      .where('lat', '>', bounds.viewport_lat_south)
      .where('lon', '<', bounds.viewport_lon_east)
      .where('lon', '>', bounds.viewport_lon_west)
      .where('geo_level', 'city')
      .query(qb => {
        qb.innerJoin(
          'feed_entries_places as fep',
          'fep.place_id',
          'places.id'
        )
      })
      .fetchAll()
  }

  static bounds(place) {
    return place.attributes;
  }

  static assignCountry(place, gPlace) {
    console.log('assignCountry', gPlace.address_components, gPlace.types);
    const countryName = this.findCountry(gPlace.address_components).long_name;

    return Place.where('name', countryName)
      .where('geo_level', 'country')
      .fetch()
      .then(countryPlace => {
        if (countryPlace) {
          console.log('DB country', countryPlace.get('id'), countryPlace.get('name'));
          return countryPlace;
        } else if (this.findCountry([gPlace], false)) {
          // place is a country. Save it so we have an id to set as the countryId.
          return place.save();
        } else {
          console.log('remote country needed', countryPlace);
          return this.populateCountry(countryName);
        }
      })
      .then(countryPlace => {
        place.setCountry(countryPlace);
        return place.save();
      });
  }

  static populateCountry(countryName) {
    // For a country not in the DB yet. Autocomplete, get details, and insert.
    return googleAPI.placeAutocomplete(countryName)
      .then(result => {
        const prediction = this.findCountry(result.predictions);
        return googleAPI.placeDetail(prediction.place_id);
      })
      .then(gPlace => {
        return this.fetchOrForge(gPlace)
          .then(countryPlace => {
            // Don't use this.updateOrCreate because it will call this method again.
            countryPlace.updateFromGooglePlace(gPlace);
            if (!this.findCountry([gPlace])) throw new Error('WTF, this is a country');
            return countryPlace.save();
          });
      })
      .then(countryPlace => {
        countryPlace.setCountry(countryPlace);
        return countryPlace.save();
      });
  }

  static findCountry(placeslike, required=true) {
    const country = _.find(placeslike, p => p.types.indexOf('country') > -1);
    if (!country && required) throw new Error(`NO COUNTRY FOUND ${placeslike}`);
    return country;
  }

}

module.exports = PlaceResource

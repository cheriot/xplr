import _ from 'lodash';

import knex from '../models/knex';
import googleAPI from '../models/google_api';
import {placeAssignCountry, placeFeedEntryCounts} from '../repositories/place_repository';
import Place from '../models/place';

class PlaceResource {

  static fetch(id, options) {
    return Place.forge({id: id}).fetch(options);
  }

  static fetchOrForge(gPlace) {
    if(_.isEmpty(gPlace.place_id)) throw new Error('No place_id');
    const forged = Place.forge({google_place_id: gPlace.place_id});
    return forged
      .fetch()
      .then(place => place || forged);
  }

  static updateDisplayPriority() {
    return placeFeedEntryCounts()
      .then(rows => {
        console.log('rows', rows);
        return rows;
      });
  }

  static updateOrCreate(gPlace) {
    return this.fetchOrForge(gPlace)
      .then(place => {
        place.updateFromGooglePlace(gPlace);
        const countryId = place.get('country_id');

        const checkCountry = () => placeAssignCountry(place, gPlace);

        if (!place.get('id')) {
          return place.save().then(checkCountry);
        } else {
          return checkCountry();
        }

      })
      .catch((message, b, c) => console.log('error', message, b, c) );
  }

  static nearestTo(place) {
    // Unneeded max() because of the group by.
    const distance = knex.raw(
      `abs(max(places.lat) - ?) + abs(max(places.lon) - ?) as distance`,
      [place.get('lat'), place.get('lon')]
    );
    return Place
      .query(qb => qb.select('places.id', distance))
      .query('select', 'places.id')
      .where('geo_level', 'city')
      .where('id', '<>', place.get('id'))
      .query('limit',5)
      .query('orderBy','distance', 'asc')
      .query(qb => {
        qb.innerJoin(
          'feed_entries_places as fep',
          'fep.place_id',
          'places.id'
        )
      })
      .query('groupBy', 'places.id')
      .fetchAll()
      .then(places => {
        const ids = places.map(p => p.get('id'));
        return Place.where('id', 'in', ids)
          .fetchAll({withRelated: ['feedEntries']})
      });
  }

  static fetchByCountry(countryId) {
    return Place
      .query('select', 'places.id')
      .where('country_id', countryId)
      .where('geo_level', 'city')
      .query(qb => {
        qb.innerJoin(
          'feed_entries_places as fep',
          'fep.place_id',
          'places.id'
        )
      })
      .query('groupBy', 'places.id')
      .fetchAll()
      .then(places => {
        const ids = places.map(p => p.get('id'))
        return Place.where('id', 'in', ids)
          .fetchAll({withRelated: ['feedEntries']})
      });
  }

  static withinViewport(place) {
    return this.boundedBy(this.bounds(place))
      .then(collection => {
        return _.filter(collection.models, found => found.id != place.id);
      });
  }

  static boundedBy(bounds) {
    return Place
      .where('lat', '<', bounds.viewport_lat_north)
      .where('lat', '>', bounds.viewport_lat_south)
      .query(qb => {
        if (bounds.viewport_lon_east > bounds.viewport_lon_west) {
          qb.where('lon', '<', bounds.viewport_lon_east)
          qb.where('lon', '>', bounds.viewport_lon_west)
        } else {
          // Bounding box crosses 180 (approx the dateline). Like ANZAC.
          qb.where(function() {
            qb.where('lon', '<', bounds.viewport_lon_east)
            qb.where('lon', '>', 0)
          })
          .orWhere(function() {
            qb.where('lon', '<', 0)
            qb.where('lon', '>', bounds.viewport_lon_west)
          });
        }
      })
      .where('geo_level', 'city')
      .query(qb => {
        qb.innerJoin(
          'feed_entries_places as fep',
          'fep.place_id',
          'places.id'
        )
      })
      .fetchAll();
  }

  static bounds(place) {
    return place.attributes;
  }


  static findCountry(placeslike, required=true) {
    const country = _.find(placeslike, p => p.types.indexOf('country') > -1);
    if (!country && required) console.warn(`NO COUNTRY FOUND ${placeslike}`);
    return country;
  }

  static hasCountry(gPlace) {
    return !!this.findCountry(gPlace.address_components, false);
  }

}

module.exports = PlaceResource

import _ from 'lodash';

import knex from '../models/knex';
import Place from '../models/place';

export function placeFeedEntryCounts() {
  return knex.raw(`
    select
      p.id as place_id,
      count(fep.feed_entry_id) as feed_entry_count,
      count(distinct fe.feed_id) as feed_count
    from places p
      inner join feed_entries_places fep on fep.place_id = p.id
      inner join feed_entries fe on fe.id = fep.feed_entry_id
    where geo_level='city'
    group by p.id
    order by count(fep.feed_entry_id) desc;`)
    .then(resp => {
      return resp.rows;
    });
}

export function placeAssignCountry(place, gPlace) {
  // Maybe relax this is a new place with a country is only saved once?
  if (!place.get('id')) console.error('assignCountry requires a saved place');
  // Already assigned a country.
  if (place.get('country_id')) return place;
  // Some places have no country: Mont Blanc, Lake Titicaca, NE Indian towns.
  if (!hasCountry(gPlace)) return place;

  const countryName = findCountry(gPlace.address_components).long_name;

  return Place.where('name', countryName)
    .where('geo_level', 'country')
    .fetch()
    .then(countryPlace => {

      if (findCountry([gPlace], false)) {
        // place is a country. Save it so we have an id to set as the countryId.
        return place.save().then(place => {
          return place.save({country_id: place.get('id')});
        });
      } else if (countryPlace) {
          console.log('DB country', countryPlace.get('id'), countryPlace.get('name'));
          return place.save({country_id: countryPlace.get('id')});
      } else {
        this.populateCountry(countryName)
          .then(countryPlace => {
            return place.save({country_id: countryPlace.get('id')});
          });
      }
    });
}

function populateCountry(countryName) {
  // For a country not in the DB yet. Autocomplete, get details, and insert.
  console.log('populateCountry', countryName);

  // Add "country" to the search string so towns named Lebanon don't crowd
  // out the country.
  return googleAPI.placeAutocomplete(`${countryName} country`, '(regions)')
    .then(result => {
      const prediction = findCountry(result.predictions);
      return googleAPI.placeDetail(prediction.place_id);
    })
    .then(gPlace => {
      return this.fetchOrForge(gPlace)
        .then(countryPlace => {
          // Don't use this.updateOrCreate because it will call this method again.
          countryPlace.updateFromGooglePlace(gPlace);
          if (!findCountry([gPlace])) throw new Error('WTF, this is a country');
          return countryPlace.save();
        });
    })
    .then(countryPlace => {
      countryPlace.setCountry(countryPlace);
      return countryPlace.save();
    });
}

function hasCountry(gPlace) {
  return !!findCountry(gPlace.address_components, false);
}

function findCountry(placeslike, required=true) {
  const country = _.find(placeslike, p => p.types.indexOf('country') > -1);
  if (!country && required) console.warn(`NO COUNTRY FOUND ${placeslike}`);
  return country;
}

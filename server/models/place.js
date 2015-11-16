import Checkit from 'checkit';

import bookshelf from './bookshelf';
import FeedEntry from './feed_entry';

const Place = bookshelf.Model.extend({
  tableName: 'places',
  hasTimestamps: true,

  initialize: function (attrs, opts) {
    //this.on('saving', this.validate);
  },

  feedEntities: function() {
    return this.belongsToMany(FeedEntry);
  },

  validate: function() {
    return new Checkit({
      geo_level: (val) => ['country', 'city', 'address'].indexOf(val) > -1
    }).run(this.attributes);
  },

  updateFromGooglePlace: function(gPlace) {
    console.log('update', this.attributes.id, this.attributes.name, 'from google');
    this.set({
      name: gPlace.name,
      google_place_id: gPlace.place_id,
      google_uri: gPlace.url,
      formatted_address: gPlace.formatted_address,
      website: gPlace.website,
    });

    // Sometimes google's autocomplete resutls will leave out the #geometry property.
    if(gPlace.lat && gPlace.lon) {
      this.set({
        lat: gPlace.lat,
        lon: gPlace.lon,
      })
    }

    if(gPlace.viewport_lat_north) {
      this.set({
        viewport_lat_north: gPlace.viewport_lat_north,
        viewport_lat_south: gPlace.viewport_lat_south,
        viewport_lon_east: gPlace.viewport_lon_east,
        viewport_lon_west: gPlace.viewport_lon_west
      })
    }

    this.updateGeoLevel(gPlace);
  },

  updateGeoLevel(gPlace) {
    const setGeoLevelIfType = (geoLevel, type) => {
      if (gPlace.types.indexOf(type) > -1) {
        this.set('geo_level', geoLevel);
      }
    }

    this.set('geo_level', 'address');
    setGeoLevelIfType('country', 'country');
    setGeoLevelIfType('city', 'locality');
    setGeoLevelIfType('city', 'sublocality');
    setGeoLevelIfType('city', 'natural_feature');
    setGeoLevelIfType('city', 'park');
    setGeoLevelIfType('city', 'administrative_area_level_1');
  },

  setCountry(place) {
    const country_id = place.get('id');
    if (!country_id) throw new Error('Country has no id');
    this.set('country_id', country_id);
  },

  isCity() {
    // Exclude continents and countries.
    const countryId = this.get('country_id');
    return countryId && countryId != this.get('id');
  },

});

module.exports = Place

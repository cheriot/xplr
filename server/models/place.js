import Checkit from 'checkit';
import slug from 'slug';

import bookshelf from './bookshelf';

const Place = bookshelf.Model.extend({
  tableName: 'places',
  hasTimestamps: true,

  initialize: function (attrs, opts) {
    //this.on('saving', this.validate);
  },

  feedEntries: function() {
    const FeedEntry = require('./feed_entry');
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

    this.updateSlug(gPlace);
    this.updateGeoLevel(gPlace);
  },

  updateSlug: function(gPlace) {
    // These are NOT unique and MUST be used with an id.
    const str = gPlace.formatted_address || gPlace.name;
    // Some formatted addresses have zip codes. Let's be prettier.
    const numberless = str.replace(/[0-9]+/g,'').toLowerCase();
    // The column is 32 characters wide.
    const dbSlug = slug(numberless).slice(0,32);
    this.set('slug', dbSlug);

    // Would be nice:
    // - don't end with a '-'
    // - always include the country name
  },

  updateGeoLevel: function(gPlace) {
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
    setGeoLevelIfType('city', 'administrative_area_level_2');
    setGeoLevelIfType('city', 'administrative_area_level_3');
    setGeoLevelIfType('city', 'colloquial_area');
    setGeoLevelIfType('city', 'point_of_interest');
    // Must be last because they're also "natural_feature"s
    setGeoLevelIfType('continent', 'continent');
  },

  setCountry: function(place) {
    const countryId = place.get('id');
    if (!countryId) throw new Error('Country has no id');
    this.set('country_id', countryId);
  },

  isCity: function() {
    // Exclude continents and countries.
    const countryId = this.get('country_id');
    return countryId && countryId != this.get('id');
  },

  isCountry: function() {
    const countryId = this.get('country_id');
    return countryId && countryId == this.get('id');
  },

  serialize: function(options) {
    const attrs = bookshelf.Model.prototype.serialize.call(this, options)
    delete attrs.google_place_id;
    delete attrs.google_uri;
    delete attrs.formatted_uri;
    delete attrs.website;
    attrs.isCity = this.isCity();
    attrs.isCountry = this.isCountry();
    attrs.uri = `/destinations/${attrs.id}/${attrs.slug}`
    return attrs;
  }
});

module.exports = Place

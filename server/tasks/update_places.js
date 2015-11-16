import _ from 'lodash';
import sleep from 'sleep';

import Place from '../models/place';
import PlaceResource from '../resources/place_resource';
import googleAPI from '../models/google_api';

Place.where('geo_level', 'city')
  .where('google_place_id', '<>', '')
  .fetchAll()
  .then(collection => {

    // Finishing updating each place before starting the next.
    return _.reduce(collection.models, (promise, place) => {
      return promise.then(() => {
        sleep.sleep(1); // polite api usage
        console.log('place api req', place.get('id'), place.get('name'));
        return googleAPI.placeDetail(place.get('google_place_id'))
          .then(gPlace => PlaceResource.updateOrCreate(gPlace));
      });
    }, Promise.resolve(1));

  })
  .then(() => process.exit());

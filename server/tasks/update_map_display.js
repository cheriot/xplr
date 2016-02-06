import PlaceResource from '../resources/place_resource'

PlaceResource.updateDisplayPriority()
  .then(() => process.exit())
  .catch((err) => {
    console.log(`ERROR: ${err}`);
    throw err;
  });

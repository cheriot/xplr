import {summarizeFeedEntries} from '../models/etl/feed_entry_importer';

summarizeFeedEntries()
  .then(() => process.exit())
  .catch((err) => {
    console.log(`ERROR: ${err}`);
    throw err;
  });

class MapResource {

  static fetch(box) {
    const { nw, ne, se, sw } = box;
    // query places with those bounds (cities only - for map markers)
    // query for feed entries with a place within those bounds
    // return {
    //   places: [],
    //   feed_entries: []
    // }
  }

  static fetchByPlace(googlePlace, box) {
    const { nw, ne, se, sw } = box;
    // fetch place
    // if place
    //   query for feed entries with that place
    // else
    //   get map bounds of that place and call fetch(box)
    //
    // return {
    //   places: [],
    //   feed_entries: []
    // }
  }

}

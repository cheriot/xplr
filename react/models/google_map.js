class GoogleMap {
  constructor(gMap) {
    this.gMap = gMap;
  }

  focus(gPlace) {
    this.gMap.fitBounds(gPlace.geometry.viewport);
  }
}

module.exports = GoogleMap

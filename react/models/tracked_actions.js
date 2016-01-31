import ga from 'react-ga'

export function trackMapDrag() {
  console.log('map drag');
  ga.event({
    category: 'Map',
    action: 'Map Drag'
  });
}

export function trackMapZoom() {
  console.log('map zoom');
  ga.event({
    category: 'Map',
    action: 'Map Zoom'
  });
}

export function trackNavRelated(rank) {
  // rank: the order listed on the page, 0 based
}

export function trackNavAutocomplete(gPlace) {
  // gPlace: google autocomplete result
}

export function trackNavMap(place) {
  // place: place from xplr's database
}

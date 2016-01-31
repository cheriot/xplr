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

export function trackNavRelated(index) {
  // index: the order listed on the page, 0 based
  ga.event({
    category: 'Navigation',
    action: 'Destination Related',
    label: `Destination Related Rank ${index}`,
    value: index
  });
}

export function trackNavAutocomplete(gPlace) {
  // gPlace: google autocomplete result
  ga.event({
    category: 'Navigation',
    action: 'Destination Autocomplete',
    label: `Destination Autocomplete ${gPlace.name}`
  });
}

export function trackNavMap(place) {
  // place: place from xplr's database
  ga.event({
    category: 'Navigation',
    action: 'Destination Map Marker',
    label: `Destination Map Marker ${place.name}`
  });
}

export function trackOutboundFeedEntry() {
  ga.outboundLink({label: 'Outbound Feed Entry'}, () => {});
}

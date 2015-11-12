// Wrap the global mapInitializers array with a promise.

export default new Promise((resolve, reject) => {
  const initializer = () => { resolve(google.maps) }

  // Avoid errors when compiled on the server.
  if(typeof mapInitialized == 'undefined') return;

  if (mapInitialized) {
    initializer();
  } else {
    mapInitializers.push(initializer);
  }
});

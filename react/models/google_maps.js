// Wrap the global mapInitializers array with a promise.

export default new Promise((resolve, reject) => {
  const initializer = () => { resolve(google.maps) }
  if (mapInitialized) {
    initializer();
  } else {
    mapInitializers.push(initializer);
  }
});

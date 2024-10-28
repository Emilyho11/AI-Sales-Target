export const searchNearbyLawFirms = (map, lat, lng, callback) => {
  const service = new window.google.maps.places.PlacesService(map);
  const location = new window.google.maps.LatLng(lat, lng);

  const request = {
    location: location,
    radius: '2000', // Radius in meters
    type: ['lawyer'], // Google Maps API supports 'lawyer' type for law firms
  };

  service.nearbySearch(request, (results, status) => {
    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
      callback(results);
    } else {
      callback([]);
    }
  });
};

// src/components/Map.js

import React, { useRef, useState, useCallback } from "react";
import { GoogleMap, LoadScript, StandaloneSearchBox, Marker, InfoWindow } from "@react-google-maps/api";

const Map = () => {

  // Set default center (latitude, longitude) of Toronto
  const defaultCenter = {
    lat: 43.651070,
    lng: -79.347015,
  };

  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [places, setPlaces] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const searchBox = useRef(null);

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation  = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Center map on user's location
          setCenter(userLocation);
          // Add user location marker
          setMarkers([{ lat: userLocation.lat, lng: userLocation.lng }]);
          // Search for nearby places
          searchNearbyPlaces(userLocation.lat, userLocation.lng);
        },
        () => {
          alert("Unable to retrieve your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };
    
  // Search for nearby places
  const searchNearbyPlaces = (lat, lng) => {
    const service = new window.google.maps.places.PlacesService(map);
    const location = new window.google.maps.LatLng(lat, lng);

    const request = {
      location: location,
      radius: '500', // Radius in meters
      type: ['lawyer'], // Adjust the type of places you're searching for. Google Maps API supports 'lawyer' type for law firms
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);

        // Create markers for each place
        const newMarkers = results.map(place => ({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          place: place,
        }));
        setMarkers(newMarkers);
      }
    });
  };

  // Handle places changed event (when a location is searched)
  const onPlacesChanged = () => {
    const places = searchBox.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry.location;

      // Update the center and add a new marker
      setCenter({ lat: location.lat(), lng: location.lng() });
      // Add new marker to the array
      setMarkers([{ lat: location.lat(), lng: location.lng() }]);
      // Search nearby places
      searchNearbyPlaces(location.lat(), location.lng());
    }
  };

  // Handle marker click to show info about the place
  const onMarkerClick = (place) => {
    setSelectedPlace(place);
  };

  // On map load, set map instance
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  return (
    <div className="w-2/3 h-[650px]">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["places"]}>
        <div className="z-10 w-3/4 md:w-1/2">
          <StandaloneSearchBox
            onLoad={ref => (searchBox.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for places..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </StandaloneSearchBox>
        </div>
        <button
          className="top-4 right-4 z-10 bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={getUserLocation}
        >
          My Location
        </button>
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={12}
          onLoad={onLoad}
        >
          {markers.map((marker, index) => (
            <Marker
              key={index}
              position={{ lat: marker.lat, lng: marker.lng }}
              onClick={() => onMarkerClick(marker.place)}
            />
          ))}
          {selectedPlace && (
            <InfoWindow
              position={{ lat: selectedPlace.geometry.location.lat(), lng: selectedPlace.geometry.location.lng() }}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div>
                <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
                <p>{selectedPlace.vicinity}</p>
                <p>Rating: {selectedPlace.rating || 'N/A'}</p>
                <p>{selectedPlace.opening_hours?.open_now ? 'Open' : 'Closed'}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

      </LoadScript>
    </div>
  );
};

export default Map;

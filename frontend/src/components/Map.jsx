// src/components/Map.js

import React, { useRef, useState, useCallback } from "react";
import { GoogleMap, StandaloneSearchBox, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

// Move the libraries array outside the component to prevent re-creation on each render
const libraries = ["places"];

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // Pass the static libraries array
  });

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
  const [searchLocation, setSearchLocation] = useState(null); // Save the location from the search box

  // Blue marker icon
  const blueMarkerIcon = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // URL of the blue marker
  };

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Center map on user's location
          setCenter(userLocation);
          setSearchLocation(userLocation);
          setMarkers([{ lat: userLocation.lat, lng: userLocation.lng, icon: blueMarkerIcon }]); // Add user location marker with blue icon

          // Search for nearby law firms
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
      type: ['lawyer'], // Google Maps API supports 'lawyer' type for law firms
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);

        // Create markers for each place
        const newMarkers = results.map((place) => ({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          place: place,
          icon: null, // Default marker for law firms
        }));
        setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
      }
    });
  };

  // Handle places changed event (when a location is searched)
  const onPlacesChanged = () => {
    const places = searchBox.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      const location = place.geometry.location;

      // Update the center with the searched location
      setSearchLocation({ lat: location.lat(), lng: location.lng() });
      setCenter({ lat: location.lat(), lng: location.lng() });
      setMarkers([{ lat: location.lat(), lng: location.lng(), icon: blueMarkerIcon }]); // Add a blue marker for the searched location
    }
  };

  // Search for law firms based on the current center of the map
  const onSearchLawFirmsClick = () => {
    if (searchLocation) {
      searchNearbyPlaces(searchLocation.lat, searchLocation.lng);
    } else {
      alert("Please search for a location first or allow location access.");
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

  if (!isLoaded) {
    return <div>Loading...</div>; // Display a loading message while the map is loading
  }

  return (
    <div className="w-2/3 h-[650px]">
      <div className="flex items-center z-10 w-full space-x-2 py-4">
        <StandaloneSearchBox
          onLoad={(ref) => (searchBox.current = ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type="text"
            placeholder="Search for places..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
        </StandaloneSearchBox>
        <button
          className="bg-dark_green hover:bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={onSearchLawFirmsClick}
        >
          Search law firms
        </button>
        <button
          className="top-4 right-4 z-10 bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-lg"
          onClick={getUserLocation}
        >
          My Location
      </button>
      </div>
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
            icon={marker.icon} // Apply custom icon to mark original location
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
    </div>
  );
};

export default Map;

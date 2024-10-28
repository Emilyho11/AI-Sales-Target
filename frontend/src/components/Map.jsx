import React, { useRef, useState, useCallback, useEffect } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { searchNearbyLawFirms } from "../utils/lawFirmSearch";

const libraries = ["places"];

const Map = ({ onLawFirmsFound, searchBarValue, isSearchPressed, userLocation }) => {
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

  // Blue marker icon
  const blueMarkerIcon = {
    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // URL of the blue marker
  };

  // Effect to update markers when userLocation changes and isSearchPressed is true
  useEffect(() => {
    if (isSearchPressed && userLocation) {
      setCenter(userLocation);
      setMarkers([{ lat: userLocation.lat, lng: userLocation.lng, icon: blueMarkerIcon }]);
      searchNearbyLawFirms(map, userLocation.lat, userLocation.lng, (results) => {
        setPlaces(results);
        onLawFirmsFound(results);
        const newMarkers = results.map((place) => ({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          place: place,
          icon: null,
        }));
        setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
      });
    }
  }, [isSearchPressed, userLocation, map, onLawFirmsFound]);

  // Effect to handle search bar input
  useEffect(() => {
    if (searchBarValue) {
      setMarkers([]);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchBarValue }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          setCenter({ lat: location.lat(), lng: location.lng() });
          setMarkers([{ lat: location.lat(), lng: location.lng(), icon: blueMarkerIcon }]);
        }
      });
    }
  }, [searchBarValue]);

  // Effect to handle userLocation changes
  useEffect(() => {
    if (userLocation) {
      setMarkers([]);
      setCenter(userLocation);
      setMarkers([{ lat: userLocation.lat, lng: userLocation.lng, icon: blueMarkerIcon }]);
    }
  }, [userLocation]);

  // Effect to handle search button pressed
  useEffect(() => {
    if (isSearchPressed && searchBarValue) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: searchBarValue }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          setCenter({ lat: location.lat(), lng: location.lng() });
          setMarkers([{ lat: location.lat(), lng: location.lng(), icon: blueMarkerIcon }]);
          searchNearbyLawFirms(map, location.lat(), location.lng(), (results) => {
            setPlaces(results);
            onLawFirmsFound(results);
            const newMarkers = results.map((place) => ({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              place: place,
              icon: null,
            }));
            setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
          });
        } else {
          alert("Location not found. Please try again.");
        }
      });
    }
  }, [isSearchPressed, searchBarValue, map, onLawFirmsFound]);

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
              <p>{selectedPlace.opening_hours?.isOpen() ? 'Open' : 'Closed'}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;

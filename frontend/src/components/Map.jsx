// src/components/Map.js

import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const Map = () => {

  // Set default center (latitude, longitude) of Toronto
  const center = {
    lat: 43.651070,
    lng: -79.347015,
  };
  
  return (
    <div className="w-2/3 h-[650px]">
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerClassName="w-full h-full"
          center={center}
          zoom={10}
        >
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;

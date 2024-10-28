// This function returns a Google Maps Link of directions to a location specified
function GetDirections(location) {
    // Encode the location to make it suitable for a URL
    const encodedLocation = encodeURIComponent(location);
  
    // Google Maps API endpoint for directions
    const apiEndpoint = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;
  
    return apiEndpoint;
  }
    
  export default GetDirections;
  
  // Sample usage
  const location = "Times Square, New York";
  const directionsLink = GetDirections(location);
  console.log("Directions link:", directionsLink);

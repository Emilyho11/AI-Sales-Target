import React, { useState, useRef, useEffect } from 'react';
import ContentContainer from '../components/ContentContainer';
import Map from '../components/Map';
import { StandaloneSearchBox, useLoadScript } from "@react-google-maps/api";
import PlacesSidePopup from '../components/PlacesSidePopup';
import { useAuth } from '../components/AuthContext';

const libraries = ["places"];

const Home = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [lawFirms, setLawFirms] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState('');
  const [isSearchPressed, setIsSearchPressed] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const searchBox = useRef(null);
  const [isClickedToOpen, setIsClickedToOpen] = useState(false);
  const [selectedLawFirm, setSelectedLawFirm] = useState(null);
  const { getName } = useAuth();

  const handleLawFirmsFound = (firms) => {
    setLawFirms(firms);
  };

  const handleLawFirmSelect = (lawFirm) => {
    setSelectedLawFirm(lawFirm);
    setIsClickedToOpen(true); // Open the popup when a law firm is selected
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setSearchBarValue(''); // Reset search bar value when user location is set
        },
        () => {
          alert("Unable to retrieve your location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const onPlacesChanged = () => {
    const places = searchBox.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];
      setSearchBarValue(place.formatted_address); // Set the searchBarValue as a string
      setUserLocation(null); // Reset user location when a place is searched
    }
  };

  const onSearchLawFirmsClick = () => {
    setIsSearchPressed(true);
  };

  useEffect(() => {
    if (isSearchPressed) {
      setIsSearchPressed(false); // Reset the search pressed state after handling
    }
  }, [isSearchPressed]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps</div>;
  }

  const handleOpenPopup = (firm) => {
    setIsClickedToOpen(true);
    setSelectedLawFirm(firm);
  };

  const handleClosePopup = () => {
    setIsClickedToOpen(false);
    setSelectedLawFirm(null);
  };
  
  return (
    <ContentContainer>
      <h2>Welcome, {getName()}</h2>
        <div className="flex items-center z-10 w-full space-x-2 py-4">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBox.current = ref)}
            onPlacesChanged={onPlacesChanged}
          >
            <input
              type="text"
              placeholder="Search for places..."
              value={searchBarValue}
              onChange={(e) => setSearchBarValue(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring focus:ring-blue-500"
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
        <div className='flex gap-8 pb-10'>
          <Map 
            onLawFirmsFound={handleLawFirmsFound} 
            searchBarValue={searchBarValue} 
            isSearchPressed={isSearchPressed} 
            userLocation={userLocation}
            onLawFirmSelect={handleLawFirmSelect}
          />
          <div className='w-1/3'>
            {/* <button onClick={testing}>Test</button> */}
            {isClickedToOpen ? (
              <div>
                <PlacesSidePopup lawFirm={selectedLawFirm} handleClosePopup={handleClosePopup} />
              </div>
            ) : (
              <>
                <h3 className='text-xl font-bold p-4 bg-clio_color'>Nearby Law Firms <span className='font-medium text-sm'> ({lawFirms.length} Found)</span></h3>
                <ul className='scroll-y-auto h-[590px] xl:h-[750px] overflow-y-auto'>
                  {lawFirms.map((firm, index) => (
                    <li 
                      key={index}
                      className={`py-2 px-4 ${index % 2 === 0 ? 'bg-gray-300 hover:bg-white hover:cursor-pointer' : 'bg-gray-200 hover:bg-white hover:cursor-pointer'} border-b border-gray-300`}
                      onClick={() => handleOpenPopup(firm)}
                    >
                      <h4 className="text-md font-semibold">{firm.name}</h4>
                      <p>{firm.vicinity}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
        </div>
      </div>
    </ContentContainer>
  );
};

export default Home;

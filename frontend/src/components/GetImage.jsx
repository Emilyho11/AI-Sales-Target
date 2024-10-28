import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GetImage = ({ selectedImage, className="" }) => {
  const [imageURL, setImageURL] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const searchImage = async () => {
      const subscriptionKey = `${import.meta.env.VITE_MS_AZURE_KEY}`;
      const searchUrl = "https://api.bing.microsoft.com/v7.0/images/search";
      const headers = { "Ocp-Apim-Subscription-Key": subscriptionKey };
      const params = { q: selectedImage, count: 1 };

      try {
        const response = await axios.get(searchUrl, { headers, params });
        const searchResults = response.data;

        if (searchResults.value && searchResults.value.length > 0) {
          const firstResult = searchResults.value[0];
          const imageUrl = firstResult.contentUrl;
          setImageURL(imageUrl);
          setError('');
        } else {
          setError("No images found for the location: " + selectedImage);
        }
      } catch (error) {
        setError("Error fetching images: " + error.message);
      }
    };

    // if (selectedImage) {
      searchImage();
    // }
  }, [selectedImage]);

  return (
    <>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    <div className={`container bg-gray-200 ${className}`}>
        <img
          src={imageURL}
          alt="Image..."
          className="w-full h-full object-cover"
        />
    </div>
    </>
  );
};

export default GetImage;

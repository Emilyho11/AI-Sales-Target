import React, { useEffect, useState } from 'react'
import GetImage from './GetImage'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faExternalLink, faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import GetDirections from '../../../backend/api_calls/GoogleMapsLink';

const PlacesSidePopup = ({ lawFirm, handleClosePopup }) => {
  console.log(lawFirm);

  // Call the GetDirections function
  const directionsLink = GetDirections(lawFirm.name);
  console.log("Directions link:", directionsLink);

  return (
    <div className='bg-gray-300 h-[650px]'>
        <div className='bg-clio_color p-4'>
            <button onClick={handleClosePopup} className='text-black hover:text-black/50 py-2 rounded-lg'>
            <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h3 className='text-xl font-bold'>{lawFirm.name}</h3>
          </div>
        {/* {lawFirm.photos && (
          <img src={lawFirm.photos[0].getUrl()} alt={lawFirm.name} className='w-full h-60 object-cover' />
        )} */}
        <GetImage selectedImage={lawFirm.name} className='h-64' />
        <div className='p-4'>
          <p className='font-bold'>Address: <span className='font-normal'>{lawFirm.vicinity}</span></p>
          <p>Rating: {lawFirm.rating}</p>
          {/* {website && (
            <p>
              Website: <a href={website} target="_blank" rel="noopener noreferrer">{website}</a>
            </p>
          )} */}
        </div>
        <div className='p-4 grid grid-cols-2 gap-6'>
          <button className='flex gap-4 bg-dark_green hover:bg-green-600 text-white rounded-lg py-2 justify-center items-center' onClick={() => window.open(directionsLink, '_blank')}>
            Directions
            <FontAwesomeIcon icon={faExternalLink} className='mr-2' />
          </button>
          <button className='flex gap-4 bg-[#E35447] hover:bg-[#e87e74] text-white rounded-lg py-2 justify-center items-center' onClick={() => window.open(directionsLink, '_blank')}>
            Send Email
            <FontAwesomeIcon icon={faEnvelope} className='mr-2' />
          </button>
          <button className='flex gap-4 bg-clio_color hover:bg-blue-400 text-white rounded-lg py-2 justify-center items-center' onClick={() => window.open(directionsLink, '_blank')}>
            Create Pitch
            <FontAwesomeIcon icon={faPlus} className='mr-2' />
          </button>
          <button className='flex gap-4 bg-clio_color hover:bg-blue-400 text-white rounded-lg py-2 justify-center items-center' onClick={() => window.open(directionsLink, '_blank')}>
            More Information
            <FontAwesomeIcon icon={faInfoCircle} className='mr-2' />
          </button>
        </div>
    </div>
  )
}

export default PlacesSidePopup

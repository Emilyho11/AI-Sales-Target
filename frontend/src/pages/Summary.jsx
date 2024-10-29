import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import GetImage from '../components/GetImage'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faExternalLink, faHouse, faStar, faStarHalfAlt, faPhone, faPlus, faGlobe, faDollarSign, faInfoCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { summarizeContent } from '../utils/AIsummarizer.js';
import ContentContainer from '../components/ContentContainer';
import GetDirections from '../../../backend/api_calls/GoogleMapsLink';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const Summary = () => {
  // const [summary, setSummary] = useState('');
  const [searchParams] = useSearchParams();
  const lawFirmString = searchParams.get('lawFirm');
  const lawFirm = JSON.parse(decodeURIComponent(lawFirmString));
  const website = searchParams.get('website');
  const summary = searchParams.get('summary');
  // const website = "https://accordlaw.ca/";

  // const lawFirm = { 
  //   name: "Test Law Firm",
  //   vicinity: "123 Test Street, Toronto, ON",
  //   phone: "123-456-7890",
  //   email: "info@test.com",
  //   rating: 5,
  //   opening_hours: { weekday_text: ["Monday: 9am-5pm", "Tuesday: 9am-5pm", "Wednesday: 9am-5pm", "Thursday: 9am-5pm", "Friday: 9am-5pm", "Saturday: Closed", "Sunday: Closed"] },
  //   price_level: 2,
  //   business_status: "Open",
  // }

  console.log('summary:', summary);
  const directionsLink = GetDirections(lawFirm.name);

  const handleClosePopup = () => {
    window.history.back();
  }

  const getStarIcons = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FontAwesomeIcon key={i} icon={faStar} className="inline-block w-4 h-4 text-yellow-500" />);
      } else if (i < rating) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfAlt} className="inline-block w-4 h-4 text-yellow-500" />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={regularStar} className="inline-block w-4 h-4 text-yellow-500" />);
      }
    }
    return stars;
  };

  return (
    <ContentContainer>
      <div>
        <button onClick={handleClosePopup} className='text-black hover:text-black/50 py-2 rounded-lg flex gap-4 items-center'>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>
        <h3 className='text-3xl font-bold text-black p-4'>{lawFirm.name}</h3>
        {/* {lawFirm.photos && (
          <img src={lawFirm.photos[0].getUrl()} alt={lawFirm.name} className='w-full h-60 object-cover' />
        )} */}
          <div className='md:flex gap-12 p-4'>
            <GetImage selectedImage={lawFirm.name} className='object-contain w-1/3 h-1/3' />
              <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <FontAwesomeIcon icon={faHouse} className='text-lg' />
                  <p className='font-bold'>Address: <span className='font-normal'>{lawFirm.vicinity}</span></p>
                </div>
                {lawFirm.phone && (
                  <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faPhone} className='text-lg' />
                    <p className='font-bold'>Phone: <span className='font-normal'>{lawFirm.phone}</span></p>
                  </div>
                )}
                {lawFirm.email && (
                  <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faEnvelope} className='text-lg' />
                    <p className='font-bold'>Email: <span className='font-normal'>{lawFirm.email}</span></p>
                  </div>
                )}
                {lawFirm.rating && (
                  <div className='flex items-center gap-2'>
                    <FontAwesomeIcon icon={faStar} className="text-lg" />
                    <p className='font-bold'>Rating: <span className='font-normal'>{getStarIcons(lawFirm.rating)}</span></p>
                  </div>
                )}
                {lawFirm.price_level && (
                  <div className='flex items-center gap-4'>
                    <FontAwesomeIcon icon={faDollarSign} className="text-lg" />
                    <p className='font-bold'>Price Level: <span className='font-normal'>{lawFirm.price_level}</span></p>
                  </div>
                )}
                {website && (
                  <p className='font-bold'>
                    <FontAwesomeIcon icon={faGlobe} className="text-lg mr-3" />
                    Website: <a className='text-link_color hover:text-blue-500 underline font-normal' href={ website } target='_blank' rel='noreferrer'>{ website }</a>
                  </p>
                )}
              </div>
          </div>
          <div className='p-4'>
            <p className='font-bold'>Summary:</p>
            <p>{summary}</p>
            <div className='p-4 grid grid-cols-2 gap-6 w-1/3'>
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
          </div>
        </div>
      </div>
    </ContentContainer>
  )
}

export default Summary

import React, { useEffect, useState } from 'react'
import GetImage from './GetImage'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faExternalLink, faStar, faStarHalfAlt, faInfoCircle, faPlus, faClock } from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import GetDirections from '../../../backend/api_calls/GoogleMapsLink';
import { useNavigate } from 'react-router-dom';
import { summarizeContent } from '../utils/AIsummarizer.js';

const PlacesSidePopup = ({ lawFirm, handleClosePopup }) => {
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getWebsite = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/get-website?place_id=${lawFirm.place_id}`);
        console.log('Website:', response.data);
        if (response.status !== 200) {
          console.error('Error fetching website:', response.data);
          return;
        }
        setWebsite(response.data);
      } catch (error) {
        console.error('Error fetching website:', error.response ? error.response.data : error.message);
      }
    }
    getWebsite();
  }, [lawFirm, handleClosePopup]);

  useEffect(() => {
    const getContactInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/scrape-contact-info?url=${website}`);
        console.log('Contact Info:', response.data);
        if (response.status !== 200) {
          console.error('Error fetching contact info:', response.data);
          return;
        }
        setEmail(response.data.emails[0]);
        setPhone(response.data.phoneNumbers[0]);
      } catch (error) {
        console.error('Error fetching contact info:', error.response ? error.response.data : error.message);
      }
    }
    if (website) {
      getContactInfo();
    }
  }, [website]);

  // Call the GetDirections function
  const directionsLink = GetDirections(lawFirm.name);
  console.log("Email:", email);
  console.log("Phone:", phone);

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

  const summarize = async () => {
    try {
      const summary = await summarizeContent(website, "firm_summary", "gpt-4");
      return summary;
    } catch (error) {
      console.error('Error:', error);
      return '';
    }
  };

  const handleNavigateAndSummarize = async () => {
    setLoading(true);
    const summary = await summarize();
    const lawFirmString = encodeURIComponent(JSON.stringify(lawFirm));
    navigate(`/summarizer?lawFirm=${lawFirmString}&website=${encodeURIComponent(website)}&summary=${encodeURIComponent(summary)}`);
  };

  return (
    <div className='bg-gray-300 h-[650px] scroll-y-auto overflow-auto'>
      {loading && (
      <div className='absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-75 z-50'>
        <div className='text-4xl font-bold'>Loading...</div>
      </div>
      )}
      <div className='bg-clio_color p-4'>
          <button onClick={handleClosePopup} className='text-black hover:text-black/50 py-2 rounded-lg'>
          <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h3 className='text-xl font-bold'>{lawFirm.name}</h3>
        </div>
        {/* {lawFirm.photos && (
          <img src={lawFirm.photos[0].getUrl()} alt={lawFirm.name} className='w-full h-60 object-cover' />
        )} */}
        <div className='h-80 max-h-80'>
          <GetImage selectedImage={lawFirm.name} className='object-contain w-full h-full border border-gray-300' />
      </div>
        <div className='p-4'>
          {lawFirm.rating && (
            <p className='font-bold'>Rating: <span className='font-normal'>{getStarIcons(lawFirm.rating)}</span></p>
          )}
          <p className='font-bold'>Address: <span className='font-normal'>{lawFirm.vicinity}</span></p>
          {phone && (
            <div className='flex items-center gap-2'>
              <p className='font-bold'>Phone: <span className='font-normal'>{phone}</span></p>
            </div>
          )}
          {email && (
            <div className='flex items-center gap-2'>
              <p className='font-bold'>Email: <span className='font-normal'>{email}</span></p>
            </div>
          )}
          {website && (
            <p className='font-bold'>
              Website: <a className='text-link_color hover:text-clio_color underline font-normal' href={ website } target='_blank' rel='noreferrer'>{ website }</a>
            </p>
          )}
          {lawFirm.opening_hours && lawFirm.opening_hours.weekday_text && (
            <div className='flex gap-2'>
              <FontAwesomeIcon icon={faClock} className="text-lg pt-1 pr-1" />
              <div>
                <p className={`font-bold ${lawFirm.business_status === 'Open' ? 'text-green-500' : 'text-red-500'}`}>
                  {lawFirm.business_status}
                </p>
                  
                <p className='font-bold'>
                  Hours:
                </p>
                <ul className='list-disc pl-4'>
                  {lawFirm.opening_hours.weekday_text.map((hours, index) => (
                    <li key={index}>{hours}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
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
          <button
            className='flex gap-4 bg-clio_color hover:bg-blue-400 text-white rounded-lg py-2 justify-center items-center'
            onClick={handleNavigateAndSummarize}
          >
            More Information
            <FontAwesomeIcon icon={faInfoCircle} className='mr-2' />
          </button>
        </div>
    </div>
  )
}

export default PlacesSidePopup

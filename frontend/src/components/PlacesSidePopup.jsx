import React, { useEffect, useState } from 'react';
import GetImage from './GetImage';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faExternalLink, faStar, faStarHalfAlt, faInfoCircle, faPlus, faClock, faHouse, faPhone, faDollarSign, faGlobe, faChevronUp, faChevronDown, faCheck, faGauge, faMeteor, faChartLine, faHandshake } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck, faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import GetDirections from '../../../backend/api_calls/GoogleMapsLink';
import { useNavigate } from 'react-router-dom';
import { summarizeContent } from '../utils/AIsummarizer.js';
import PitchPopup from './PitchPopup';
import Markdown from 'react-markdown';

const PlacesSidePopup = ({ lawFirm, handleClosePopup }) => {
  const [website, setWebsite] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingComparison, setLoadingComparison] = useState(false);
  const [loadingPitch, setLoadingPitch] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isPitchPopupVisible, setIsPitchPopupVisible] = useState(false);
  const [pitch, setPitch] = useState('');
  const [comparison, setComparison] = useState('');
  const [isComparisonVisible, setIsComparisonVisible] = useState(false);
  const [isFullComparisonVisible, setIsFullComparisonVisible] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [isFullSummaryVisible, setIsFullSummaryVisible] = useState(false);
  const [percentage, setPercentage] = useState('');
  const [summary, setSummary] = useState('');

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
    };
    getWebsite();
  }, [lawFirm, handleClosePopup]);

  useEffect(() => {
    const getContactInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/scrape-contact-info?url=${website}`);
        if (response.status !== 200) {
          console.error('Error fetching contact info:', response.data);
          return;
        }
        setEmail(response.data.emails[0]);
        setPhone(response.data.phoneNumbers[0]);
      } catch (error) {
        console.error('Error fetching contact info:', error.response ? error.response.data : error.message);
      }
    };

    const getPercentage = async () => {
      if (percentage === '') {
        try {
          const result = await summarizeContent(website, "percentage", "gpt-3.5-turbo");
          setPercentage(result);
        } catch (error) {
          console.error('Error:', error);
          return '';
        }
      }
    };

    if (website) {
      getContactInfo();
      getPercentage();
    }
  }, [website]);

  // Call the GetDirections function
  const directionsLink = GetDirections(lawFirm.name);

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
    if (summary === '') {
      setLoadingSummary(true);
      try {
        const summary = await summarizeContent(website, "firm_summary", "gpt-4");
        setSummary(summary);
        setLoadingSummary(false);
      } catch (error) {
        console.error('Error:', error);
        setLoadingSummary(false);
        return '';
      }
    }
    setIsSummaryVisible(!isSummaryVisible);
  };

  const createPitch = async () => {
    if (pitch === '') {
      setLoadingPitch(true);
      try {
        const pitch = await summarizeContent(website, "pitch", "gpt-4o");
        setPitch(pitch);
        setLoadingPitch(false);
      } catch (error) {
        console.error('Error:', error);
        setLoadingPitch(false);
        return '';
      }
    }
    setIsPitchPopupVisible(true);
  };

  const clioCompare = async () => {
    if (comparison === '') {
      setLoadingComparison(true);
      try {
        const response = await summarizeContent(website, "clio_compare", "gpt-4o");
        setComparison(response);
        setLoadingComparison(false);
      } catch (error) {
        console.error('Error:', error);
        setComparison('');
        setLoadingComparison(false);
      }
    }
    setIsComparisonVisible(!isComparisonVisible);
  };

  const toggleFullSummary = () => {
    setIsFullSummaryVisible(!isFullSummaryVisible);
  };

  const toggleFullComparison = () => {
    setIsFullComparisonVisible(!isFullComparisonVisible);
  };

  const getTextPreview = (text) => {
    const sentences = text.split('. ');
    return sentences.slice(0, 4).join('. ') + (sentences.length > 4 ? '...' : '');
  };

  const handleSummarize = async () => {
    setLoadingSummary(true);
    await summarize();
  };

  const handleCreatePitch = async () => {
    await createPitch();
  };

  const handleClosePitchPopup = () => {
    setIsPitchPopupVisible(false);
  };

  if (isPitchPopupVisible) {
    return (
      <div className='flex z-50 bg-gray-300 h-[650px] scroll-y-auto overflow-auto'>
        <PitchPopup lawFirm={lawFirm} pitch={pitch} onClose={handleClosePitchPopup} />
      </div>
    );
  }

  const parseDoubleNewLines = (comparison) => comparison.replace(/\n\s*\n/g, '\n');
  const condensedComparison = parseDoubleNewLines(comparison);

  return (
    <div className='bg-gray-300 h-[650px] scroll-y-auto overflow-auto relative'>
      {loadingPitch && (
        <div className='absolute inset-0 flex items-center justify-center bg-gray-300 bg-opacity-75 z-50'>
          <div className='p-4 bg-white border rounded shadow-lg'>
            <p>Loading...</p>
          </div>
        </div>
      )}
      <div className='bg-clio_color p-4'>
        <button onClick={handleClosePopup} className='text-black hover:text-black/50 py-2 rounded-lg'>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h3 className='text-xl font-bold'>{lawFirm.name}</h3>
      </div>
      {lawFirm.photos && (
            <img src={lawFirm.photos[0].getUrl()} alt={lawFirm.name} className='w-full h-60 object-cover' />
          )}
      {!lawFirm.photos && (
        <div className='h-80 max-h-80'>
        <GetImage selectedImage={lawFirm.name} className='object-contain w-full h-full border border-gray-300' />
      </div>
      )}
      <div className='p-4 space-y-2'>
        <div className='flex items-center gap-2'>
          <FontAwesomeIcon icon={faHouse} className='text-lg' />
          <p className='font-bold'>Address: <span className='font-normal'>{lawFirm.vicinity}</span></p>
        </div>
        {phone && (
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faPhone} className='text-lg' />
            <p className='font-bold'>Phone: <span className='font-normal'>{phone}</span></p>
          </div>
        )}
        {email && (
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faEnvelope} className='text-lg' />
            <p className='font-bold'>Email: <span className='font-normal'>{email}</span></p>
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
            Website: <a className='text-link_color hover:text-clio_color underline font-normal' href={website} target='_blank' rel='noreferrer'>{website}</a>
          </p>
        )}
        <p className='font-bold flex'>
          <FontAwesomeIcon icon={faChartLine} className="text-lg mr-3" />
          <p className='font-bold'>Likelihood of becoming a client: <span className='font-normal'>{percentage}</span></p>
        </p>

      </div>
      <div className='p-4'>
        <div className='relative'>
          <button
            className='flex gap-2 py-2 hover:text-clio_color text-link_color justify-center items-center'
            onClick={handleSummarize}
          >
            Summary
            <FontAwesomeIcon icon={isSummaryVisible ? faChevronUp : faChevronDown} />
          </button>
          {loadingSummary && summary === '' && (
            <div className='mt-2 p-4 bg-gray-100 border rounded shadow-lg'>
              <p>Loading...</p>
            </div>
          )}
          {isSummaryVisible && summary && (
            <div className='mt-2 p-4 bg-gray-100 border rounded shadow-lg'>
              <p className='whitespace-pre-wrap'><Markdown>{isFullSummaryVisible ? summary : getTextPreview(summary)}</Markdown></p>
              <div className='flex justify-between items-center mt-2'>
                <button onClick={toggleFullSummary} className='text-link_color hover:text-clio_color underline'>
                  {isFullSummaryVisible ? 'View Less' : 'View More'}
                </button>
                {isSummaryVisible && (
                  <div className='flex items-center text-red-600 hover:text-red-400 cursor-pointer' onClick={handleSummarize}>
                    <p>Close</p>
                    <FontAwesomeIcon icon={faChevronUp} className='ml-2'/>
                  </div>
                )}
              </div>
            </div>
          )}
          
        </div>
        <div className='relative'>
          <button
            className='flex gap-2 py-2 hover:text-clio_color text-link_color justify-center items-center'
            onClick={clioCompare}
          >
            How can Clio help?
            <FontAwesomeIcon icon={faSquareCheck} />
            <FontAwesomeIcon icon={isComparisonVisible ? faChevronUp : faChevronDown} />
          </button>
          {loadingComparison && comparison === '' && (
            <div className='mt-2 p-4 bg-gray-100 border rounded shadow-lg'>
              <p>Loading...</p>
            </div>
          )}
          {isComparisonVisible && comparison && (
            <div className='mt-2 p-4 bg-gray-100 border rounded shadow-lg'>
              <p className='whitespace-pre-wrap'>
                <Markdown>{isFullComparisonVisible ? comparison : getTextPreview(condensedComparison)}</Markdown>
              </p>
              <div className='flex justify-between items-center mt-2'>
                <button onClick={toggleFullComparison} className='text-link_color hover:text-clio_color underline'>
                  {isFullComparisonVisible ? 'View Less' : 'View More'}
                </button>
                {isComparisonVisible && (
                  <div className='flex items-center text-red-600 hover:text-red-400 cursor-pointer' onClick={clioCompare}>
                    <p>Close</p>
                    <FontAwesomeIcon icon={faChevronUp} className='ml-2'/>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='p-4 grid grid-cols-2 gap-6'>
        <button
          className='flex gap-4 bg-clio_color hover:bg-blue-400 text-white rounded-lg py-2 justify-center items-center'
          onClick={handleSummarize}
        >
          More Information
          <FontAwesomeIcon icon={faInfoCircle} className='mr-2' />
        </button>
        <button className='flex gap-4 bg-[#E35447] hover:bg-[#e87e74] text-white rounded-lg py-2 justify-center items-center' onClick={() => window.open(directionsLink, '_blank')}>
          Send Email
          <FontAwesomeIcon icon={faEnvelope} className='mr-2' />
        </button>
        <button className='flex gap-4 bg-clio_color hover:bg-blue-400 text-white rounded-lg py-2 justify-center items-center' onClick={handleCreatePitch}>
          Create Pitch
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
        </button>
        <button className='flex gap-4 bg-dark_green hover:bg-green-600 text-white rounded-lg py-2 justify-center items-center' onClick={() => window.open(directionsLink, '_blank')}>
          Directions
          <FontAwesomeIcon icon={faExternalLink} className='mr-2' />
        </button>
      </div>
    </div>
  );
};

export default PlacesSidePopup;

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import GetImage from '../components/GetImage'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope, faExternalLink, faHouse, faStar, faStarHalfAlt, faPhone, faPlus, faGlobe, faDollarSign, faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { summarizeContent } from '../utils/AIsummarizer.js';
import ContentContainer from '../components/ContentContainer';
import GetDirections from '../../../backend/api_calls/GoogleMapsLink';
import { faSquareCheck, faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import Markdown from 'react-markdown'

const Summary = () => {
  const [comparison, setComparison] = useState('');
  const [isComparisonVisible, setIsComparisonVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFullSummaryVisible, setIsFullSummaryVisible] = useState(false);
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
  console.log("COMPARISON", comparison);

  const directionsLink = GetDirections(lawFirm.name);

  const handleClosePopup = () => {
    window.history.back();
  }

  useEffect(() => {
    const parseEmail = () => {
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const emailMatch = summary.match(emailRegex);
      if (emailMatch) {
        setEmail(emailMatch[0]);
      }
    };
    const parsePhone = () => {
      // Matches phone numbers in the format 123-456-7890, 123.456.7890, 1234567890, (123) 456-7890, etc.;
      const phoneRegex = /(?:\d{3}[-.]?){2}\d{4}|\(\d{3}\) \d{3}-\d{4}/g;
      const phoneMatch = summary.match(phoneRegex);
      if (phoneMatch) {
        setPhone(phoneMatch[0]);
      }
    };
    parsePhone();
    parseEmail();
  }, [summary]);

  const clioCompare = async () => {
    if (comparison === '') {
      setLoading(true);
      try {
        const response = await summarizeContent(website, "clio_compare", "gpt-4o");
        setComparison(response);
      } catch (error) {
        console.error('Error:', error);
        setComparison('');
      }
    }
    setIsComparisonVisible(!isComparisonVisible);
  };

  const parseDoubleNewLines = (comparison) => comparison.replace(/\n\s*\n/g, '\n');
  const condensedComparison = parseDoubleNewLines(comparison);

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

  const toggleFullSummary = () => {
    setIsFullSummaryVisible(!isFullSummaryVisible);
  };

  const getSummaryPreview = (text) => {
    const sentences = text.split('. ');
    return sentences.slice(0, 6).join('. ') + (sentences.length > 6 ? '...' : '');
  };

  return (
    <ContentContainer>
      <div className='mx-52'>
        <button onClick={handleClosePopup} className='text-link_color hover:text-clio_color py-2 rounded-lg flex gap-4 items-center'>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>
        <h3 className='text-3xl font-bold text-black p-4'>{lawFirm.name}</h3>
        {/* {lawFirm.photos && (
          <img src={lawFirm.photos[0].getUrl()} alt={lawFirm.name} className='w-full h-60 object-cover' />
        )} */}
          <div className='md:flex gap-12 p-4'>
            <GetImage selectedImage={lawFirm.name} className='object-contain w-1/3 h-1/3 border' />
              <div className='space-y-4'>
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
                    Website: <a className='text-link_color hover:text-clio_color underline font-normal' href={ website } target='_blank' rel='noreferrer'>{ website }</a>
                  </p>
                )}
              </div>
          </div>
          <div className='p-4'>
            <p className='font-bold'>Summary:</p>
            <p className='whitespace-pre-wrap'>
              <Markdown>{isFullSummaryVisible ? summary : getSummaryPreview(summary)}</Markdown>
            </p>
            <button onClick={toggleFullSummary} className='text-link_color hover:text-clio_color underline'>
              {isFullSummaryVisible ? 'View Less' : 'View More'}
            </button>
            <div className='relative'>
              <button
              className='flex gap-2 py-2 hover:text-clio_color text-link_color justify-center items-center'
              onClick={clioCompare}
              >
                How can Clio help?
                <FontAwesomeIcon icon={faSquareCheck} />
                <FontAwesomeIcon icon={isComparisonVisible ? faChevronUp : faChevronDown} />
              </button>
              {loading && comparison === '' && (
                <div className='mt-2 p-4 bg-gray-100 border rounded shadow-lg'>
                  <p>Loading...</p>
                </div>
              )}
              {isComparisonVisible && comparison && (
                <div className='mt-2 p-4 bg-gray-100 border rounded shadow-lg'>
                  <p className='whitespace-pre-wrap'><Markdown>{condensedComparison}</Markdown></p>
                </div>
              )}
            </div>
            <div className='pt-8 grid grid-cols-3 gap-4 w-1/3'>
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

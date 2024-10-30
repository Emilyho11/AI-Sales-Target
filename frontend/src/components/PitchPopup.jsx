import React from 'react'
import Markdown from 'react-markdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const PitchPopup = ({ lawFirm, pitch, onClose, email }) => {
  const navigate = useNavigate();

  const emailNavigate = () => {
    navigate('/emailEditor', { state: { sender: "", recipientEmail: email, recipientName: lawFirm.name, pitch: pitch } });
  }

  return (
    <div>
        <div className='bg-clio_color p-4'>
            <button onClick={onClose} className='text-black hover:text-black/50 py-2 rounded-lg'>
            <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h3 className='text-xl font-bold'>{lawFirm.name}</h3>
        </div>
        <div className='p-8 whitespace-pre-wrap'>
            <Markdown>{pitch}</Markdown>
            <button className='flex gap-4 bg-[#E35447] hover:bg-[#e87e74] text-white rounded-lg py-2 justify-center items-center p-4' onClick={emailNavigate}>
            Send Email
            <FontAwesomeIcon icon={faEnvelope} className='mr-2' />
          </button>
        </div>
    </div>
  )
}

export default PitchPopup

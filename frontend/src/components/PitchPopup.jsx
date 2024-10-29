import React from 'react'
import Markdown from 'react-markdown'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const PitchPopup = ({ lawFirm, pitch, onClose }) => {
  return (
    <div>
        <div className='bg-clio_color p-4'>
            <button onClick={onClose} className='text-black hover:text-black/50 py-2 rounded-lg'>
            <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <h3 className='text-xl font-bold'>{lawFirm.name}</h3>
        </div>
        <div className='p-4'>
            <Markdown>{pitch}</Markdown>
        </div>
    </div>
  )
}

export default PitchPopup

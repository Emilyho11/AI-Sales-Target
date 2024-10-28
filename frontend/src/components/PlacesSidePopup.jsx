import React from 'react'

const PlacesSidePopup = ({ lawFirm, handleClosePopup }) => {
  console.log(lawFirm.name)
  console.log(lawFirm.vicinity)
  return (
    <div className='bg-gray-300'>
        <div className='bg-clio_color p-4'>
            <button onClick={handleClosePopup} className='text-black px-4 py-2 rounded-lg'>Back</button>
            <h3 className='text-xl font-bold'>{lawFirm.name}</h3>
          </div>
        <div className='p-4'>
          <p>Address: {lawFirm.vicinity}</p>
          <p>Rating: {lawFirm.rating}</p>
        </div>
    </div>
  )
}

export default PlacesSidePopup

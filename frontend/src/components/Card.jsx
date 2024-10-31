import React from 'react'

const Card = (props) => {
  return (
    <div className={"w-full rounded-lg p-4 drop-shadow-md gap-4 items-center " + props.className} >
        {props.children}
    </div>
  )
}

export default Card

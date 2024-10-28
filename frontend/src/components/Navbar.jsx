import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBook, faSignOutAlt, faBars } from "@fortawesome/free-solid-svg-icons";
import ClioLogo from '../assets/clio-logo.png'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const myLinks = [
    { name: 'Home', url: '/', icon: faHouse },
    { name: 'My Library', url: '/myLibrary', icon: faBook },
    { name: 'Logout', url: '/logout', icon: faSignOutAlt },
  ]

  return (
    <header className='header flex w-full h-[72px] bg-gray-200 relative shadow z-10'>
      <div className='flex items-center ml-16'>
        <img src={ClioLogo} alt='Clio Logo' className='w-[135px] h-[50px]' />
      </div>
      <div className="m-4 mr-32 absolute top-5 right-0 gap-14 text-base hidden lg:flex">
					{myLinks.map((link, index) => (
						<NavLink
							key={index}
							to={link.url}
							className={({ isActive }) =>
								[
									"text-clio_color hover:text-dark_green transition-all pb-2 ",
									!isActive ? "active" : "!text-dark_green scale-110 border-b-2 border-dark_green",
								].join(" ")
							}
						>
							{link.name}
							<FontAwesomeIcon icon={link.icon} className="ml-2" />
						</NavLink>
					))}
				</div>
        <div className="lg:hidden flex items-center absolute top-0 right-0 m-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-clio_color hover:text-dark_green focus:outline-none"
          >
            <FontAwesomeIcon icon={faBars} className="text-2xl text-clio_color hover:text-dark_green" />
          </button>
			  </div>
        {isOpen && (
          <div className="lg:hidden absolute top-14 right-0 w-1/2 md:w-1/3 bg-gray-200 shadow-lg flex flex-col text-lg z-10 gap-2 p-2">
            {myLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.url}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  [
                    "text-clio_color hover:text-dark_green transition-all text-right mr-8",
                    !isActive ? "active" : "!text-dark_green scale-110 underline",
                  ].join(" ")
                }
              >
                {link.name}
                <FontAwesomeIcon icon={link.icon} className="ml-2" />
              </NavLink>
            ))}
          </div>
        )}
    </header>
  )
}

export default Navbar

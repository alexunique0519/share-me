import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { IoMdAdd, IoMdSearch } from 'react-icons/io'
import { User } from '../utils'

interface NavBarPropType {
  searchText: string
  setSearchText: any
  user: User
}


const Navbar = ({searchText, setSearchText, user}: NavBarPropType) => {
  const navigate = useNavigate()
  
  if (!user) return null

 
  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
        <IoMdSearch fontSize={21} className="ml-1" />
        <input 
          type={"text"}
          onChange={ (e) => setSearchText(e.target.value)}
          placeholder="Search"
          value={searchText}
          onFocus={() => navigate('/search')}
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className='flex gap-3'>
        <Link 
          to={`/user-profile/${user?._id}`} 
          className="hidden md:block">
          <img src={user.image} className="w-14 h-12 rounded-lg" />
        </Link>
        <Link 
          to={'/create-pin'} 
          className="bg-red-500 text-white rounded-lg w-12 h-12 md:w-14 md:h-12 flex justify-center items-center">
            <IoMdAdd />
        </Link>
      </div>
    </div>
  )
}

export default Navbar
import React, {useState} from 'react'
import {Routes, Route} from 'react-router-dom'
import { Navbar, Feed, PinDetail, CreatePin, Search, UserProfile } from '../components'
import { User } from '../utils'

interface PinPropType {
  user: User | any
}


const Pins = ({user}: PinPropType) => {
  const [searchText, setSearchText] = useState('')


  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar searchText={searchText} setSearchText={setSearchText} user={user && user} />
      </div>
      <div className='h-full'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route path='/pin-details/:pinId' element={<PinDetail  user={user} />} />
          <Route path='/create-pin' element={<CreatePin user={user} />} />
          <Route path='/search' element={<Search searchText={searchText} setSearchText={setSearchText} user={user} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins
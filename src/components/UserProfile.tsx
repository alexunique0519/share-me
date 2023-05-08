import React, {useState, useEffect, useId} from 'react'
import { AiOutlineLogout } from 'react-icons/ai'
import { useParams, useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import { userCreatedPinsQuery, userSavedPinsQuery, userQuery } from '../utils/data'

import { client } from '../client'
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'

const activeBtnStyles = 'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles = 'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';


const UserProfile = () => {
  const [user, setUser] = useState<any>(null)
  const [pins, setPins] = useState([])
  const [text, setText] = useState<string|null>('')
  const [activeBtn, setActiveBtn] = useState('created')
  const navigate = useNavigate()
  const {userId} = useParams()

  let loggedInUser = null
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    loggedInUser = JSON.parse(storedUser)
  }

  useEffect(() => {
     const query = userQuery(userId)
     client.fetch(query)
      .then(data => {
        setUser(data[0])
      })
  }, [useId])

  useEffect(() => {
    if (text === 'Created') {
      const createPinQuery = userCreatedPinsQuery(userId)
      client.fetch(createPinQuery)
        .then(data => {
          setPins(data)
        })
    } else {
      const savedPinQuery = userSavedPinsQuery(userId)
      client.fetch(savedPinQuery)
        .then(data => {
          setPins(data)
        })
    }
  }, [text, userId])

  const logout  = () => {
    localStorage.clear()
    navigate('/login')
  }

  if (!user) return <Spinner message='loding user profile'/>

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      <div className='flex flex-col pb-5'>
        <div className='flex flex-col mb-7 justify-center items-center'>
          <img
            className='w-full h-370 2xl:h-510 shadow-lg'
            src='https://source.unsplash.com/1600x900/?nature,photograth,technology'
            alt='user pic'
          />
          <img
            className='rounded-full w-20 h-20 -mt-10 shadow-xl'
            src={user.image}
            alt='profile img'
          />
        </div>
        <h1 className='font-bold text-3xl text-center mt-3'>{user.userName}</h1>
        <div className='absolute top-0 z-1 right-2 p-2'>
          {userId === user._id && (
            <button
              type='button'
              className='bg-white p-2 rounded-full cursor-pointer outline-none'  
              onClick={() => {googleLogout(); 
                logout()
              }}
            >
              <AiOutlineLogout color="red" fontSize={20} />
            </button>
          )}
        </div>
      </div>
      <div className='text-center mb-7'>
        <button 
          type='button'
          onClick={e => {
            setText(e.currentTarget.textContent)
            setActiveBtn('Created')
          }}
          className={`${activeBtn === 'Created' ? activeBtnStyles : notActiveBtnStyles}`}
        >
          Created
        </button>
        <button
          type='button'
          onClick={e => {
            setText(e.currentTarget.textContent)
            setActiveBtn('Saved')
          }}
          className={`${activeBtn === 'Saved' ? activeBtnStyles : notActiveBtnStyles}`}
        >
          Saved
        </button>
      </div>
      <div className='px-2'>
          <MasonryLayout pins={pins} />
      </div>
      {pins?.length === 0 && (
        <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
          No Pins Found!
        </div>
      )}

    </div>
  )
}

export default UserProfile
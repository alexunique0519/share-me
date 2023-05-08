import React, {useState} from 'react'
import { client, urlFor } from '../client'
import {Link, useNavigate } from 'react-router-dom'
import { MdDownloadForOffline, MdOutlineTurnedInNot, MdOutlineTurnedIn} from 'react-icons/md'
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs'
import { isDeleteExpression } from 'typescript'
import { AiTwotoneDelete } from 'react-icons/ai'

const Pin = ({pin}: any) => {
  const [postHovered, setPostHovered] = useState(false)
  const navigate = useNavigate()
  
  const userString = localStorage.getItem('user')
  if (!userString) {
    return null
  }

  const user = JSON.parse(userString)

  const foundUser = pin?.save?.filter( (item:any) => item.postedBy?._id === user?._id)
  const alreadySaved = !!foundUser?.length


  const savePin = (id:any) => {
    if (!alreadySaved) {
      console.log(id)

      client.patch(id)
        .setIfMissing({save: []})
        .insert('after', 'save[-1]', [{
          _key: (new Date()).getTime(),
          userId: user._id,
          postedBy: {
            _type: 'postedBy',
            _ref: user._id
          } 
        }])
        .commit()
        .then(() => {
        })

    } 
  }

  const deletePin = (id:any) => {
    client.delete(id)
    .then(() => {

    })
  }


  return (
    <div className='m-2'>
      <div 
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-details/${pin._id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        >
          <img className='rounded-lg w-full' alt='post image' src={urlFor(pin.image).width(250).url()}  />
          {postHovered && (
            <div
              className='absolute top-0 w-full h-full flex flex-col justify-between pl-1 py-2 pr-2 z-50'
              style={{height: '100%'}}>
                <div className='flex items-center justify-between'>
                  <div className='flex gap-1'>
                    <a
                      href={`${pin?.image?.asset.url}?dl=`} 
                      download
                      onClick={e=>{
                        e.stopPropagation()
                      }}
                      className="bg-white w-8 rounded-full flex items-center justify-center text-xl opacity-70 hover:opacity-100 hover:shadow-md outline-none"
                    >
                      <MdDownloadForOffline fontSize={30}/>
                    </a>
                  </div>
                  {alreadySaved 
                    ? <button className='bg-white w-8 hover:opacity-100 text-red-500 opacity-70 p-1 rounded-3xl'>
                        <MdOutlineTurnedIn fontSize={25} />
                      </button>
                    : <button className='bg-white hover:opacity-100 text-red-500 opacity-70 p-1 rounded-3xl'
                        onClick={e => {e.stopPropagation(); 
                          savePin(pin._id)
                        }}
                      >
                        <MdOutlineTurnedInNot fontSize={25}/>
                      </button>
                  }
                </div>
                <div className='flex justify-between items-center gap-2 w-full'>
                {pin.destination && (
                    <a 
                      href={pin.destination}
                      target="_blank"
                      rel='noreferrer'
                      className='bg-white flex items-center gap-2 text-black font-bold py-2 px-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md'
                    >
                      <BsFillArrowUpRightCircleFill />
                      <span className='font-sm'>{pin.destination.slice(5, 15)}</span>
                    </a>
                )}
                {pin.postedBy?._id === user._id && (
                  <button
                    type='button'
                    onClick={e => {
                      e.stopPropagation();
                      deletePin(pin?._id)
                    }}
                    className="bg-white p-2 opacity-70 hover:opacity-100 text-dark font-bold rounded-full"
                  >
                    <AiTwotoneDelete />
                  </button>
                )}
                </div>
            </div>
          )}
      </div>
      <Link to={`/user-profile/${pin?.postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img 
          className='w-8 rounded-full object-cover'
          src={pin.postedBy.image}
          alt="user profile image"
        />
        <p className='font-semibold capitalize'>{pin.postedBy.userName}</p>
      </Link>
    </div>
  )
}

export default Pin
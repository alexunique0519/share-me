import React, {useState, useEffect} from 'react'
import { MdDownloadForOffline } from 'react-icons/md'
import {Link, useParams} from 'react-router-dom'
import { client, urlFor } from '../client'
import MasonryLayout from './MasonryLayout'
import { pinDetailMorePinQuery,pinDetailQuery } from '../utils/data'
import Spinner from './Spinner'

const PinDetail = ({ user }: any) => {
  const [pins, setPins] = useState([])
  const [pinDetails, setPinDetails] = useState<any>(null)
  const [comment, setComment] = useState('')
  const [addingComment, setAddingComment] = useState(false)
  const { pinId } = useParams()
  
  useEffect(()=> {
    fetchPinDetails()
  }, [pinId])

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId)
    if (query) {
      client.fetch(query)
        .then((data) => {
          setPinDetails(data[0])
          console.log('data', data[0])

          if (data[0]){
            const query1 = pinDetailMorePinQuery(data[0])
            client.fetch(query1)
              .then(res => {
                setPins(res)
              })
          }
        })
    }
  }

  if (!pinDetails) 
  return <Spinner message="Loading pins' details" />
  

  const addComment = () => {
    if(comment && pinId ) {
      setAddingComment(true)

      client.patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: new Date().getTime(), postedBy: { _type: 'postedBy', _ref: user._id} }])
        .commit()
        .then(()=> {
          setComment('')
          setAddingComment(false)
          fetchPinDetails()
        })

    }
  }


  return (
    <>
      { pinDetails && (
          <div className='flex xl:flex-row flex-col m-auto bg-white max-w-[1500px] rounded-[32px]'>
            <div className='flex justify-center items-center md:items-start flex-initial'>
              <img
                className='rounded-t-3xl '
                src={urlFor(pinDetails.image).url()}
                alt='user post'
              />
            </div>
            <div className='w-full p-5 flex-1 xl:min-w-620'>
              <div className='flex items-center justify-between'>
                <div className='gap-2 items-center'>
                  <a 
                    href={`${pinDetails.image.asset.url}?dl=`}
                    download
                    className='bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-70 hover:opacity-100'
                  >
                    {<MdDownloadForOffline />}
                  </a>
                </div>
                <div className='text-xs bg-gray-200 p-2 rounded-full'>
                  <a href={pinDetails.destination}
                  target='_blank'
                  >
                    {pinDetails.destination?.slice(8, 50)}
                  </a>
                </div>
              </div>
              <div>
                <h1 className='text-3xl font-bold break-words mt-3'>
                  {pinDetails.title}
                </h1>
                <p className='mt-3'>{pinDetails.about}</p>
              </div>
              <Link 
                to={`/user-profile/${pinDetails.postedBy._id}`}
                className='flex gap-2 mt-5 items-center bg-white rounded-lg'
              >
                <img 
                  src={pinDetails.postedBy.image}
                  className='rounded-full w-8'
                  alt='user profile'
                />
                <p className='font-bold'>{pinDetails.postedBy.userName}</p>
              </Link>
              <h2 className='mt-5 text-xl'>Comments</h2>
              <div className='max-h-370 overflow-y-auto'>
                {pinDetails.comments?.map((comment:any) => (
                  <div className='flex gap-2 mt-5 items-center bg-white rounded-lg' key={comment._id}>
                    <img 
                      src={comment.postedBy.image}
                      className='w-8 rounded-full cursor-pointer'
                      alt='user profile'
                    />
                    <div className='flex flex-col'>
                      <p className='font-bold'>{comment.postedBy.userName}</p>
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className='flex flex-wrap mt-6 gap-3'>
                <Link to={`/user-profile/${user?._id}`}>
                  <img src={user?.image} className='w-8 rounded-full cursor-pointer' alt='user profile'/>
                </Link>
                <input
                  className='flex-1 border-gray-100 outline-none border-b-2 p-2 rounded-2xl focus:border-gray-300'
                  type='text'
                  placeholder='Add a comment'
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                />
                <button
                  type='button'
                  className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
                  onClick={addComment}
                >
                  {addingComment ? 'Adding...' : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        )
      }
      {pins?.length > 0 && (
        <>
          <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
            More pins like this 
          </h2>
          <MasonryLayout pins={pins} />
        </>
    
      )}
    </>
    
  )
}

export default PinDetail
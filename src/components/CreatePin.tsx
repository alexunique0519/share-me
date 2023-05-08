import React, {InputHTMLAttributes, SelectHTMLAttributes, useState} from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { client } from '../client'
import Spinner from './Spinner'
import { categories } from '../utils/data'
import { isTemplateExpression } from 'typescript'


const imageFileTypeArr = [
  'image/png',
  'image/svg',
  'image/jpg',
  'image/jpeg',
  'image/gif',
  'image/tiff'
]

const CreatePin = ({ user }: any) => {
  const [title, setTitle] = useState("")
  const [about, setAbout] = useState("")
  const [destination, setDestination] = useState("")
  const [loading, setLoading] = useState(false)
  const [missingFields, setFields] = useState(false)
  const [category, setCategory] = useState('')
  const [imageAsset, setImageAsset] = useState<any>(null)
  const [wrongImageType, setWrongImageType] = useState(false)

  const navigate = useNavigate()
  
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const selectedFile = files?.[0]
    if (!selectedFile) {
      return false
    }
    if(imageFileTypeArr.includes(selectedFile.type)) {
      setWrongImageType(false)
      setLoading(true)
      client.assets
        .upload('image', selectedFile, {contentType: selectedFile.type, filename: selectedFile.name})
        .then((document:any) => {
          setImageAsset(document)
          setLoading(false)
        })
        .catch((error:string) => {
          console.log(`Upload image failed due to error: ${error}.`)
        })
    } else {
      setLoading(false)
      setWrongImageType(true)
    }
  }

  const savePin = () => {
    if (title 
      && about
      && destination
      && imageAsset._id 
      && category){
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user?._id
        },
        category
      }
      client.create(doc).then(() => {
        navigate('/')
      })    
    } else {
      setFields(true)
      setTimeout(() => {
        setFields(false)
      }, 2000)
    }
    
  }

  
  return (
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>
      {missingFields && (
        <p className='text-red-500 mb-5 text-xl transition-all duration-150 ease-in'>Please fill all fields.</p>
      )}
      <div className='flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 lg:w-4/5 w-full'>
        <div className='bg-secondaryColor flex-1 p-3 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-2 w-full h-420'>
            {loading && <Spinner message='loading'/>}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload />
                    </p>
                    <p>Click to upload</p>
                    <p className='mt-36 text-gray-500'>Use high-quality JPG, PNG, SVG, GIF, or TIFF less then 20mb</p>
                  </div>
                  <input 
                    type={"file"}
                    name="upload-image"
                    onChange={uploadImage}
                    className="w-0 h-0"
                  />
                </div>
              </label>
            ) : (
              <div className='relative h-full'>
                <img
                  src={imageAsset?.url}
                  alt="upload image"
                  className='h-full w-full'
                />
                <button
                  type='button'
                  className='absolute bottom-2 right-2 p-2 rounded-full bg-white cursor-pointer hover:shadow-md'  
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete size={25} color="#4a4a4a"/>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className='flex  flex-col gap-6 lg:pl-5 mt-5 w-full lg:w-2/5'>
          <input 
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value)
            }}
            placeholder="Add your title here"
            className='outline-none text-base sm:text-lg border-b-2 border-gray-300 p-2'
          />
          
          <input 
            type='text'
            value={about}
            onChange={e => setAbout(e.target.value)}
            placeholder='Tell more about your pin'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-300 p-2'
          />

          <input 
            type='text'
            value={destination}
            onChange={e => setDestination(e.target.value)}
            placeholder='Add a reference link'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-300 p-2'
          />

          <div className='flex flex-col'>
            <>
              <p className='mb-2 font-semibold text-lg sm-text-xl'>Choose Pin Category</p>
              <select
                onChange={ (e:React.FormEvent<HTMLSelectElement>) => {
                  setCategory(e.currentTarget.value)
                }}
                className='outline-none w-4/5 text-base border-b-2 border-gray-300 rounded-md cursor-pointer'
              >
                <option value='others' className='sm:text-base bg-white'>Select a category</option>
                {
                  categories.map(category => (
                    <option className='text-base border-0 outline-none capitalize bg-white'
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))
                }
              </select>
            </>
          </div>

          {user && (
            <div className='flex gap-2 mx-2 items-center bg-white rounded-lg'>
              <img 
                src={user.image}
                className='w-10 h-10 rounded-full'
                alt='profile image'
              />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}

          <div className='flex justify-end items-end my-5 mr-2'>
              <button 
                type='button'
                onClick={savePin}
                className='bg-red-500 text-white font-bold p-2 w-28 outline-none'
              >
                Save pin
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePin
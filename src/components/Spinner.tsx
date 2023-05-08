import React from 'react'
import { Circles } from 'react-loader-spinner'

interface SpinnerPropType {
  message: string
}

const Spinner = ({message}:SpinnerPropType) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Circles 
        color="#00BFFF"
        height={50}
        width={200}
      />
      <p className='text-lg text-center px-2'>{message}</p>
    </div>
  )
}

export default Spinner
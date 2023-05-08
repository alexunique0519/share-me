import React from "react"
import { useNavigate } from "react-router-dom"
import { FcGoogle } from 'react-icons/fc'
import weshareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png'
import { GoogleLogin, googleLogout } from "@react-oauth/google"
import { createOrGetUser } from "../utils"
import { client } from "../client"

const Login = () => {
  const navigate = useNavigate()

  const responseGoogle = (response:object) => {

    const user = createOrGetUser(response)
    localStorage.setItem('user', JSON.stringify(user))

    client.createIfNotExists(user)
      .then(() => {
        navigate('/', {replace: true})
      })
  }


  return (<div className="flex justify-start items-center flex-col h-screen">
    <div className="relative w-full h-full">
      <video 
        src={weshareVideo}
        loop
        controls={false}
        muted
        autoPlay
        className="w-full h-full object-cover"
      />

      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
        <div className="p-5">
          <img src={logo} width="130px" alt="we share logo" />
        </div>
        <div className="shadow-2xl">
          <GoogleLogin 
            onSuccess={responseGoogle}
            onError={() => console.log('error')}
          />
        </div>
      </div>
    </div>
  </div>)
}

export default Login
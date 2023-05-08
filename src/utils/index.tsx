import userEvent from "@testing-library/user-event"
import jwt_decode from "jwt-decode"

export interface User {
  _id: string
  _type: string
  userName: string
  image: string
}


export const createOrGetUser = (response:any): User => {

  const decoded : { name: string, picture: string, sub: string} = jwt_decode(response.credential)

  const { name, picture, sub} = decoded

  const user:User = {
    _id: sub, 
    _type: 'user', 
    userName: name,
    image: picture
  }

  return user
}
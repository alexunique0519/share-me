import React, {useState, useEffect } from 'react'
import { User } from '../utils'
import MasonryLayout from './MasonryLayout'
import { client } from '../client'
import { feedQuery, searchQuery } from '../utils/data'
import Spinner from './Spinner'

interface SearchPropType {
  searchText: string
  setSearchText: any
  user: User
}

const Search = ({searchText}: SearchPropType) => {
  const [pins, setPins] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchText !== '') {
      setLoading(true)
      const query = searchQuery(searchText.toLowerCase())
      client.fetch(query)
        .then(data => {
          setPins(data)
          setLoading(false)
        })
    } else {
      client.fetch(feedQuery)
        .then(data => {
          setPins(data)
          setLoading(false)
        })
    }

  }, [searchText])



  return (
    <div>
      {loading && <Spinner message='Searching for pins' />}
      {pins?.length > 0 
        ? <MasonryLayout pins={pins} /> 
        : <p className='mt-10 text-center text-xl'>No pins found</p>} 

    </div>
  )
}

export default Search
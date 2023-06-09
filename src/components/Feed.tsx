import React, {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import MasonryLayout from "./MasonryLayout"
import Spinner from "./Spinner"
import { searchQuery, feedQuery } from '../utils/data'
import { skipPartiallyEmittedExpressions } from 'typescript'


const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState([])
  const { categoryId }  = useParams()
  
  useEffect(() => {
    setLoading(true)

    console.log('categoryId', categoryId)

    if (categoryId) {
      const query = searchQuery(categoryId)
      client.fetch(query)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })
    } else {
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data)
          setLoading(false)
        })

    }
  }, [categoryId])


  if (loading)
    return <Spinner message="We are adding new ideas to your feed" />

  return (
    <div>
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed
import React from 'react'
import '../index.css'
import { useSelector } from 'react-redux'

export default function Notification() {

  const notification = useSelector( state => state.notifications )

  if (notification === '') {
    return null
  }
  // error-msg / success-msg
  return (
    <div className='message_container'>{ notification }</div>
  )
}

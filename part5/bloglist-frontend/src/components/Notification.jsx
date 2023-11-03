import React from 'react'
import '../index.css'

export default function Notification({message, msgType}) {
  
    if( message === null){
        return null
    }
    // error-msg / success-msg
    return (
        <div className={msgType}>{message}</div>
      );
}

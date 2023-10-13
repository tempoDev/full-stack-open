import React from 'react'
import '../index.css'

export default function Notification({message, msgType}) {
  
    if( message === null){
        return null
    }
    
    console.log("SHOW AS ", msgType)

    return (
        message.includes("ERROR")
          ? <div className='error-msg'>{message}</div>
          : <div className='success-msg'>{message}</div>
      );
}

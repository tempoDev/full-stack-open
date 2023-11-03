import React, { forwardRef, useImperativeHandle, useState } from 'react'
import '../index.css'

const Togglable = forwardRef((props, refs) => {
  
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : ''}
    const showWhenVisible = { display: visible ? '' : 'none'}

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle( refs, () => {
        return { toggleVisibility }
    })

    return (
    <>
        <div style={hideWhenVisible}>
            <button onClick={toggleVisibility}>{props.label}</button>
        </div>
        <div style={showWhenVisible}>
            {props.children}
            <button onClick={toggleVisibility} className='cancel_button'>Cancel</button>
        </div>
    </>
  )
})

export default Togglable

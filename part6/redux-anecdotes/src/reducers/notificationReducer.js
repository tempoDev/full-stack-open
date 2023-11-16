import { createSlice } from "@reduxjs/toolkit"

export const setNotification = (text, timeout) => {
    return dispatch => {
        dispatch(showNotification(text))
        setTimeout( () => {
            dispatch(hideNotification())
        }, timeout * 1000)
    }
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers:{
        showNotification(state, action){
            return action.payload
        },
        // eslint-disable-next-line no-unused-vars
        hideNotification(state, action){
            return ''
        }
    }
})

export const { showNotification, hideNotification } = notificationSlice.actions
export default notificationSlice.reducer
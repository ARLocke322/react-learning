import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: { message: '', type: null },
    reducers: {
        setNotification: (state, action) => {
            const { message, type = null } = action.payload
            return { message, type }
        },
        clearNotification: () => ({ message: '', type: 'success' })
    }
})

export const { setNotification: setNotificationAction, clearNotification } = notificationSlice.actions

export const setNotification = (message, type = 'success', timeout = 5000) => {
    return (dispatch) => {
        dispatch(setNotificationAction({ message, type }))
        setTimeout(() => dispatch(clearNotification()), timeout)
    }
}

export default notificationSlice.reducer
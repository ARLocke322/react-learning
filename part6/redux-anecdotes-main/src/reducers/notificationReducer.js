import { createSlice } from '@reduxjs/toolkit'


const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        addNotification(state, action) {
            const notification = action.payload
            return notification
        },
        clearNotification(state, action) {
            return ''
        }
    },
})
export const { addNotification, clearNotification } = notificationSlice.actions

export const setNotification = (message, timeout) => {
    return async dispatch => {
        dispatch(addNotification(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, timeout * 1000)
    }
}
export default notificationSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'

const initialState = null

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser(state, action) {
            return action.payload
        },
        clearUser() {
            return null
        },
    },
})
export const { setUser, clearUser } = userSlice.actions

export const addUser = (username, password) => {
    return async dispatch => {
        const user = await loginService.login({ username, password })
        console.log('hello')
        window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
        blogService.setToken(user.token)
        dispatch(setUser(user))
    }
}

export const removeUser = () => {
    return async dispatch => {
        window.localStorage.removeItem('loggedBlogappUser')
        dispatch(clearUser())
    }
}

export default userSlice.reducer
import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
    name: 'blogs',
    initialState: [],
    reducers: {
        appendBlog(state, action) {
            return state.concat(action.payload)
        },
        setBlogs(state, action) {
            return action.payload
        },
        updateBlog(state, action) {
            return state.map(blog =>
                blog.id === action.payload.id ? action.payload : blog
            )
        },
        deleteBlog(state, action) {
            return state.filter(blog =>
                blog.id !== action.payload
            )
        }
    },
})
export const { appendBlog, setBlogs, updateBlog, deleteBlog } = blogSlice.actions

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch(setBlogs(blogs))
    }
}

export const createBlog = content => {
    return async dispatch => {
        const newBlog = await blogService.create(content)
        dispatch(appendBlog(newBlog))
    }
}

export const likeBlog = blogObject => {
    return async dispatch => {
        const updatedBlog = {
            title: blogObject.title,
            author: blogObject.author,
            url: blogObject.url,
            likes: blogObject.likes + 1,
            user: blogObject.user.id
        }

        const returnedBlog = await blogService.update(blogObject.id, updatedBlog)
        dispatch(updateBlog(returnedBlog))
    }
}

export const removeBlog = blogId => {
    return async dispatch => {
        await blogService.deleteBlog(blogId)
        dispatch(deleteBlog(blogId))
    }
}
export default blogSlice.reducer
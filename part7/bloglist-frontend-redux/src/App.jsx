import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, likeBlog, initializeBlogs, removeBlog } from './reducers/blogReducer'
import { addUser, removeUser, setUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
    const dispatch = useDispatch()

    const blogs = useSelector(state => state.blogs)
    const user = useSelector(state => state.user)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const blogFormRef = useRef()



    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch(setUser(user)) // Use setUser directly for localStorage data
            blogService.setToken(user.token) // Don't forget to set the token!
        }
    }, [dispatch])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            dispatch(addUser(username, password))
            dispatch(setNotification('Logged in!', 'success', 5000))
            setUsername('')
            setPassword('')
        } catch {
            dispatch(setNotification('Wrong credentials', 'error', 5000))
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        dispatch(removeUser())
    }

    const addBlog = async (blogObject) => {
        try {
            blogFormRef.current.toggleVisibility()
            dispatch(createBlog(blogObject))
            dispatch(setNotification(`a new blog ${blogObject.title} by ${blogObject.author}`, 'success', 5000))
        } catch {
            dispatch(setNotification('Missing blog field(s)', 'error', 5000))
        }
    }

    const addLike = async (blogObject) => {
        dispatch(likeBlog(blogObject))
    }


    const deleteBlog = async (blogId) => {
        dispatch(removeBlog(blogId))
    }

    const loginForm = () => {
        return (
            <Togglable buttonLabel="login">
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleLogin={handleLogin}
                />
            </Togglable>
        )
    }
    console.log(user)

    if (user === null) {

        return (
            <div>
                <h1>Blog App</h1>
                <Notification />
                {loginForm()}
            </div>
        )
    }
    return (
        <div>
            <h1>Blog App</h1>
            <Notification />
            <div>
                <p>{user.username} logged in <button onClick={handleLogout}>logout</button></p>
                <Togglable buttonLabel="new form" innerRef={blogFormRef}>
                    <BlogForm createBlog={addBlog} />
                </Togglable>
            </div>
            <h2>blogs</h2>
            {[...blogs].sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} user={user} addLike={addLike} deleteBlog={deleteBlog} />
            )}

        </div>
    )
}

export default App
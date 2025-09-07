import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
    const [blogs, setBlogs] = useState([])

    const [message, setMessage] = useState(null)
    const [messageStyle, setMessageStyle] = useState('confirmStyle')

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [user, setUser] = useState(null)

    const blogFormRef = useRef()



    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            setUser(user)
            blogService.setToken(user.token)
            setMessage('logged in!')
            setMessageStyle('confirmStyle')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
            setUsername('')
            setPassword('')
        } catch {
            setMessage('wrong credentials')
            setMessageStyle('errorStyle')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)

    }

    const addBlog = async (blogObject) => {
        console.log('Creating blog with:', blogObject)
        try {
            blogFormRef.current.toggleVisibility()
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog))
            setMessageStyle('confirmStyle')
            setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author}`)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        } catch {
            setMessageStyle('errorStyle')
            setMessage(
                'Missing blog field(s)'
            )
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const likeBlog = async (blogObject) => {
        const returnedBlog = await blogService.update(blogObject.id,
            {
                title: blogObject.title,
                author: blogObject.author,
                url: blogObject.url,
                likes: (blogObject.likes + 1),
                user: blogObject.user.id
            })
        setBlogs(blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog))
    }

    const deleteBlog = async (blogId) => {
        await blogService.deleteBlog(blogId)
        setBlogs(blogs.filter(blog => blog.id !== blogId))
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

    if (user === null) {

        return (
            <div>
                <h1>Blog App</h1>
                <Notification message={message} style={messageStyle} />
                {loginForm()}
            </div>
        )
    }
    return (
        <div>
            <h1>Blog App</h1>
            <Notification message={message} style={messageStyle} />
            <div>
                <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
                <Togglable buttonLabel="new form" innerRef={blogFormRef}>
                    <BlogForm createBlog={addBlog} />
                </Togglable>
            </div>
            <h2>blogs</h2>
            {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                <Blog key={blog.id} blog={blog} user={user} likeBlog={likeBlog} deleteBlog={deleteBlog} />
            )}

        </div>
    )
}

export default App
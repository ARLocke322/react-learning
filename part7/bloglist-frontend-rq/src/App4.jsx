import { useState, useEffect, useRef, useContext } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import UserService from './services/users'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { useNotificationDispatch } from './NotificationContext'
import UserContext from './UserContext'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Users from './components/Users'
import { Routes, Route, Link, useMatch } from 'react-router-dom'
import User from './components/UserDetail'

const App = () => {
    const queryClient = useQueryClient()

    const result = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll
    })

    const { data: users, isLoading: userIsLoading, userError } = useQuery({
        queryKey: ['users'],
        queryFn: UserService.getAll
    })


    const newBlogMutation = useMutation({
        mutationFn: blogService.create,
        onSuccess: (returnedBlog) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            notificationDispatch({ type: 'CONFIRM', payload: `a new blog ${returnedBlog.title} by ${returnedBlog.author}` })
            setTimeout(() => {
                notificationDispatch({ type: 'CLEAR' })
            }, 5000)
        },
        onError: () => {
            notificationDispatch({ type: 'ERROR', payload: 'Wrong credentials' })
            setTimeout(() => {
                notificationDispatch({ type: 'CLEAR' })
            }, 5000)
        }
    })

    const deleteBlogMutation = useMutation({
        mutationFn: (id) => {
            return blogService.deleteBlog(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })

    const likeBlogMutation = useMutation({
        mutationFn: (blogObject) => {
            return blogService.update(blogObject.id,
                {
                    title: blogObject.title,
                    author: blogObject.author,
                    url: blogObject.url,
                    likes: (blogObject.likes + 1),
                    user: blogObject.user.id
                })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })


    const notificationDispatch = useNotificationDispatch()
    const [user, userDispatch] = useContext(UserContext)


    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const blogFormRef = useRef()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            userDispatch({ type: 'ADD', payload: user })
            blogService.setToken(user.token)
        }
    }, [userDispatch])

    const match = useMatch('/users/:id')



    if (result.isLoading) {
        return <div>loading data...</div>
    }

    if (userIsLoading) return <div>Loading users...</div>
    if (userError) return <div>Error loading users: {userError.message}</div>
    if (!users) return <div>No users found</div>


    const blogs = result.data

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({ username, password })
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            userDispatch({ type: 'ADD', payload: user })
            blogService.setToken(user.token)
            notificationDispatch({ type: 'CONFIRM', payload: 'Logged in!' })
            setTimeout(() => {
                notificationDispatch({ type: 'CLEAR' })
            }, 5000)
            setUsername('')
            setPassword('')
        } catch {
            notificationDispatch({ type: 'ERROR', payload: 'Wrong credentials' })
            setTimeout(() => {
                notificationDispatch({ type: 'CLEAR' })
            }, 5000)
        }
    }

    const handleLogout = (event) => {
        event.preventDefault()
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken(null)
        userDispatch({ type: 'CLEAR', payload: null })

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

    const padding = {
        padding: 5
    }

    const userInfo = match
        ? users.find(user => user.id === match.params.id)
        : null



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
                <Link style={padding} to='/blogs'>blogs</Link>
                <Link style={padding} to='/users'>users</Link>
                {user
                    ? <em>{user.name} logged in <button onClick={handleLogout}>logout</button></em>
                    : <Link style={padding} to="/login">login</Link>
                }
            </div>
            <Routes>
                <Route path='/users' element={<Users users={users} />} />
                <Route path='/blogs' element={
                    <div>
                        <h2>Blogs</h2>
                        <div>
                            <Togglable buttonLabel="new form" innerRef={blogFormRef}>
                                <BlogForm createBlog={newBlogMutation.mutate} />
                            </Togglable>
                        </div>
                        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
                            <Blog key={blog.id} blog={blog} user={user} likeBlog={likeBlogMutation.mutate} deleteBlog={deleteBlogMutation.mutate} />
                        )}
                    </div>
                } />
                <Route path='users/:id' element={<User user={userInfo} />} />

            </Routes>



        </div>
    )
}

export default App
import { useState, useContext, useEffect } from 'react'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import Notification from './Notification'
import UserContext from '../UserContext'
import { useNotificationDispatch } from '../NotificationContext'
import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginPage = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [, userDispatch] = useContext(UserContext)
    const notificationDispatch = useNotificationDispatch()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            userDispatch({ type: 'ADD', payload: user })
            blogService.setToken(user.token)
        }
    }, [userDispatch])

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

    return (
        <div>
            <h1>Blog App</h1>
            <Notification />
            <Togglable buttonLabel="login">
                <LoginForm
                    username={username}
                    password={password}
                    handleUsernameChange={({ target }) => setUsername(target.value)}
                    handlePasswordChange={({ target }) => setPassword(target.value)}
                    handleLogin={handleLogin}
                />
            </Togglable>
        </div>
    )

}

export default LoginPage
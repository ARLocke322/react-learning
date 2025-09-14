// App.jsx - Main container
import { useContext } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import blogService from './services/blogs'
import UserService from './services/users'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import LoginPage from './components/LoginPage'
import BlogsPage from './components/BlogsPage'
import Users from './components/Users'
import UserDetailPage from './components/UserDetailPage'
import UserContext from './UserContext'
import BlogDetail from './components/BlogDetail'

const App = () => {
    const [user] = useContext(UserContext)

    const { data: blogs = [], isLoading: blogsLoading } = useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll
    })

    const { data: users = [], isLoading: usersLoading, error: usersError } = useQuery({
        queryKey: ['users'],
        queryFn: UserService.getAll
    })

    if (blogsLoading || usersLoading) {
        return <div>Loading...</div>
    }

    if (usersError) {
        return <div>Error loading users: {usersError.message}</div>
    }

    if (!user) {
        return <LoginPage />
    }

    return (
        <div>
            <h1>Blog App</h1>
            <Notification />
            <Navigation user={user} />

            <Routes>
                <Route path='/blogs' element={<BlogsPage blogs={blogs} user={user} />} />
                <Route path='/blogs/:id' element={<BlogDetail blogs={blogs} />} />
                <Route path='/users' element={<Users users={users} />} />
                <Route path='/users/:id' element={<UserDetailPage users={users} />} />
                <Route path='/' element={<BlogsPage blogs={blogs} user={user} />} />
            </Routes>
        </div>
    )
}

export default App
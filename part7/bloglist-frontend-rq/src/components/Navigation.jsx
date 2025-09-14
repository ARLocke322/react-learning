import { useContext } from 'react'
import { Link } from 'react-router-dom'
import UserContext from '../UserContext'
import blogService from '../services/blogs'

const Navigation = ({ user }) => {
    const [, userDispatch] = useContext(UserContext)

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken(null)
        userDispatch({ type: 'CLEAR', payload: null })
    }

    const padding = { padding: 5 }

    return (
        <div>
            <Link style={padding} to='/blogs'>blogs</Link>
            <Link style={padding} to='/users'>users</Link>
            <em>
                {user.name} logged in
                <button onClick={handleLogout}>logout</button>
            </em>
        </div>
    )
}

export default Navigation
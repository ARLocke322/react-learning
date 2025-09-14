import { useMatch } from 'react-router-dom'
import UserDetail from './UserDetail'

const UserDetailPage = ({ users }) => {
    const match = useMatch('/users/:id')

    const userInfo = match
        ? users.find(user => user.id === match.params.id)
        : null

    return <UserDetail user={userInfo} />
}

export default UserDetailPage

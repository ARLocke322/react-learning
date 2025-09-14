import { Link } from 'react-router-dom'


const Users = ({ users }) => {

    return (
        <div>
            <h2 >Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Blogs created</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => <UserSummary key={user.id} user={user} />)}
                </tbody>
            </table>
        </div>
    )
}

const UserSummary = ({ user }) => {

    return (
        <tr>
            <td><Link to={`/users/${user.id}`}>{user.username}</Link></td>
            <td>{user.blogs.length}</td>
        </tr >
    )
}

export default Users
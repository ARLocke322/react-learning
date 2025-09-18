import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN, ME } from '../queries'

const LoginForm = ({ show, resetStore }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')


    const [login, result] = useMutation(LOGIN, {
        refetchQueries: [{ query: ME }],
        onError: (error) => {
            console.log(error.graphQLErrors[0].message)
        }
    })

    useEffect(() => {
        if (result.data) {
            const token = result.data.login.value
            localStorage.setItem('library-user-token', token)
            resetStore()
        }
    }, [result.data])

    if (!show) {
        return null
    }



    const submit = async (event) => {
        event.preventDefault()

        login({ variables: { username, password } })

    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    username
                    <input
                        value={username}
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password
                    <input
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit">login</button>
            </form>
        </div>
    )
}

export default LoginForm
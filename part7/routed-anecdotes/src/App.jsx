import { useState } from 'react'
import About from './components/About'
import CreateNew from './components/CreateNew'
import AnecdoteList from './components/AnecdoteList'
import Footer from './components/Footer'
import Anecdote from './components/Anecdote'
import Notification from './components/Notification'

import {
    BrowserRouter as Router,
    Routes, Route, Link, useMatch, useNavigate
} from 'react-router-dom'

const Menu = () => {
    const padding = {
        paddingRight: 5
    }
    return (
        <div>
            <Link style={padding} to='/'>anecdotes</Link>
            <Link style={padding} to='/create'>create new</Link>
            <Link style={padding} to='/about'>about</Link>
        </div>
    )
}


const App = () => {
    const match = useMatch('/anecdotes/:id')
    const navigate = useNavigate()
    const [notification, setNotification] = useState('')
    const [anecdotes, setAnecdotes] = useState([
        {
            content: 'If it hurts, do it more often',
            author: 'Jez Humble',
            info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
            votes: 0,
            id: 1
        },
        {
            content: 'Premature optimization is the root of all evil',
            author: 'Donald Knuth',
            info: 'http://wiki.c2.com/?PrematureOptimization',
            votes: 0,
            id: 2
        }
    ])



    const addNew = (anecdote) => {
        console.log(anecdote)
        anecdote.id = Math.round(Math.random() * 10000)
        setAnecdotes(anecdotes.concat(anecdote))

        navigate('/')

        setNotification(`a new anecdote ${anecdote.content} created!`)
        setTimeout(() => {
            setNotification('')
        }, 5000)
    }

    const anecdoteById = (id) =>
        anecdotes.find(a => a.id === id)

    const vote = (id) => {
        const anecdote = anecdoteById(id)

        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1
        }

        setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
    }

    const anecdote = match
        ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
        : null


    return (
        <div>
            <h1>Software anecdotes</h1>
            <Menu anecdotes={anecdotes} />
            <Notification message={notification} />
            <Routes>
                <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path='/create' element={<CreateNew addNew={addNew} />} />
                <Route path='/about' element={<About />} />
                <Route path='/anecdotes/:id' element={<Anecdote anecdote={anecdote} />} />

            </Routes>
            <Footer />
        </div>
    )
}

export default App

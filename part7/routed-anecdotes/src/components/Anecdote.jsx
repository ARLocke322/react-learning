const Anecdote = ({ anecdote }) => {
    return (
        <div>
            <h2>{anecdote.content} by {anecdote.author}</h2>
            <li>has {anecdote.votes} votes</li>
            <li>for more info see <a href={anecdote.info}>{anecdote.info}</a></li>
        </div>
    )
}

export default Anecdote
import { useState } from "react"
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries"
import { useMutation } from "@apollo/client/react"

const Authors = (props) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }

  const authors = props.authors


  const submit = async (event) => {
    event.preventDefault()
    editAuthor({ variables: { name, setBornTo: parseInt(born) } })

    setName('')
    setBorn('')

  }


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.user ?
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div>
              name
              <select onChange={({ target }) => setName(target.value)}>
                {authors.map(author =>
                  <option
                    key={author.name}
                    value={author.name}>
                    {author.name}
                  </option>
                )}
              </select>
            </div>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
        : null}

    </div>
  )
}

export default Authors

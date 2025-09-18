
const Books = (props) => {
  
  if (!props.show) return null
  
  
  const allGenres = [...new Set(props.allBooks.flatMap(book => book.genres))]

  return (
    <div>
      <h2>books</h2>
      <p>in genre {props.genreFilter || 'all genres'}</p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {props.books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {allGenres.map(genre => <button key={genre} onClick={() => props.setGenreFilter(genre)}>{genre}</button>)}
      <button onClick={() => props.setGenreFilter(null)}>all genres</button>
    </div>
  )
}

export default Books

import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Recommend from "./components/Recommend"
import { ALL_AUTHORS, ME, ALL_BOOKS, BOOK_ADDED } from "./queries";
import { useApolloClient, useQuery, useSubscription } from '@apollo/client/react'
import LoginForm from "./components/LogInForm";

// function that takes care of manipulating cache
export const updateCache = (cache, query, bookData, currentGenreFilter) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }


  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(bookData)),
    }
  })

  if (currentGenreFilter !== undefined) {
    try {
      cache.updateQuery({ query: query.query, variables: { genre: currentGenreFilter } }, ({ allBooks }) => {
        return {
          allBooks: uniqByName(allBooks.concat(bookData)),
        }
      })
    } catch (e) {
      // Query not in cache
    }
  }

  bookData.genres?.forEach(genre => {
    try {
      cache.updateQuery({ query: query.query, variables: { genre } }, ({ allBooks }) => {
        return {
          allBooks: uniqByName(allBooks.concat(bookData)),
        }
      })
    } catch (e) {
      // Query variation not in cache, ignore
    }
  })

}


const App = () => {
  const [page, setPage] = useState("authors");
  const [genreFilter, setGenreFilter] = useState(null)

  const client = useApolloClient()

  const authorsResult = useQuery(ALL_AUTHORS)
  const userResult = useQuery(ME)


  const allBooksResult = useQuery(ALL_BOOKS)
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter }
  })
  const favoriteBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: userResult.data?.me?.favoriteGenre },
    skip: !userResult.data?.me?.favoriteGenre
  })

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log('Subscription data:', data)
      const bookData = data?.data?.bookAdded
      if (bookData) {
        alert(`Book: ${bookData.title}, added by ${bookData.author.name}`)
      }

      updateCache(client.cache, { query: ALL_BOOKS }, bookData, genreFilter)
    },
  })

  if (authorsResult.loading || userResult.loading || allBooksResult.loading || booksResult.loading || favoriteBooksResult.loading) {
    return <div>loading...</div>
  }

  if (authorsResult.error || userResult.error || allBooksResult.error || booksResult.error || favoriteBooksResult.error) {
    return <div>failed to load data</div>
  }

  const logout = () => {
    localStorage.clear()
    client.resetStore()
  }

  const user = userResult.data.me


  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {user ? <button onClick={() => setPage("add")}>add book</button> : null}
        {user ? <button onClick={() => setPage("recommend")}>recommend</button> : null}
        {!user
          ? <button onClick={() => setPage('login')}>login</button>
          : <p>{userResult.data.me.username} logged in <button onClick={logout}>logout</button></p>

        }
      </div>

      <Authors show={page === "authors"} authors={authorsResult.data.allAuthors} user={user} />

      <Books show={page === "books"}
        books={booksResult.data.allBooks}
        allBooks={allBooksResult.data.allBooks}
        genreFilter={genreFilter}
        setGenreFilter={setGenreFilter} />

      <Recommend show={page === "recommend"}
        favoriteGenre={user?.favoriteGenre}
        favoriteBooks={favoriteBooksResult?.data?.allBooks}
      />


      <NewBook show={page === "add"} genreFilter={genreFilter}/>

      <LoginForm show={page === 'login'} resetStore={client.resetStore} />
    </div>
  );
};

export default App;

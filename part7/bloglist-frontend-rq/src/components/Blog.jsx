import { useState } from 'react'
import { Link } from 'react-router-dom'

const Blog = ({ blog, user, likeBlog, deleteBlog }) => {
    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = () => {
        likeBlog(blog)
    }

    const handleDelete = () => {
        if (window.confirm(`Remove ${blog.title} by ${blog.author} ?`)) {
            deleteBlog(blog.id)
        }
    }
    // <p>{blog.title} {blog.author} <button onClick={toggleVisibility}>view</button></p>

    return (
        <div style={blogStyle}>
            <div style={hideWhenVisible} data-testid="blog-summary">
                <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
            </div>
            <div style={showWhenVisible} data-testid="blog-details">
                <p>{blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button></p>
                <p>{blog.url}</p>
                <p>{blog.likes} <button onClick={handleLike}>like</button></p>
                <p>{blog.user.name}</p>
                {blog.user.username === user.username && <button onClick={handleDelete}>delete</button>}
            </div>
        </div>
    )
}

export default Blog
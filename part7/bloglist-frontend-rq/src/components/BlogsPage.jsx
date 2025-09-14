import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'
import blogService from '../services/blogs'
import { useNotificationDispatch } from '../NotificationContext'

const BlogsPage = ({ blogs, user }) => {
    const queryClient = useQueryClient()
    const notificationDispatch = useNotificationDispatch()
    const blogFormRef = useRef()

    const newBlogMutation = useMutation({
        mutationFn: blogService.create,
        onSuccess: (returnedBlog) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            notificationDispatch({
                type: 'CONFIRM',
                payload: `a new blog ${returnedBlog.title} by ${returnedBlog.author}`
            })
            setTimeout(() => {
                notificationDispatch({ type: 'CLEAR' })
            }, 5000)
        },
        onError: () => {
            notificationDispatch({ type: 'ERROR', payload: 'Failed to create blog' })
            setTimeout(() => {
                notificationDispatch({ type: 'CLEAR' })
            }, 5000)
        }
    })

    const deleteBlogMutation = useMutation({
        mutationFn: blogService.deleteBlog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })

    const likeBlogMutation = useMutation({
        mutationFn: (blogObject) => {
            return blogService.update(blogObject.id, {
                title: blogObject.title,
                author: blogObject.author,
                url: blogObject.url,
                likes: blogObject.likes + 1,
                user: blogObject.user.id,
                comments: blogObject.comments
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })

    return (
        <div>
            <h2>Blogs</h2>
            <div>
                <Togglable buttonLabel="new form" innerRef={blogFormRef}>
                    <BlogForm createBlog={newBlogMutation.mutate} />
                </Togglable>
            </div>
            {blogs
                .sort((a, b) => b.likes - a.likes)
                .map(blog => (
                    <Blog
                        key={blog.id}
                        blog={blog}
                        user={user}
                        likeBlog={likeBlogMutation.mutate}
                        deleteBlog={deleteBlogMutation.mutate}
                    />
                ))
            }
        </div>
    )
}

export default BlogsPage
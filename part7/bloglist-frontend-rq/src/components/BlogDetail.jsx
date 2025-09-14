import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMatch } from 'react-router-dom'
import blogService from '../services/blogs'
import { useState } from 'react'

const BlogDetail = ({ blogs }) => {
    const [newComment, setNewComment] = useState('')
    const queryClient = useQueryClient()
    const match = useMatch('/blogs/:id')

    const blogInfo = match
        ? blogs.find(blog => blog.id === match.params.id)
        : null

    const commentBlogMutation = useMutation({
        mutationFn: ({ blogObject, comment }) => {
            console.log(comment)
            return blogService.update(blogObject.id, {
                title: blogObject.title,
                author: blogObject.author,
                url: blogObject.url,
                likes: blogObject.likes,
                user: blogObject.user.id,
                comments: blogObject.comments.concat(comment)
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
        }
    })

    const addComment = (event) => {
        event.preventDefault()
        console.log(newComment)
        commentBlogMutation.mutate({ blogObject: blogInfo, comment: newComment })
        setNewComment('')
    }

    return (
        <div>
            <h2>{blogInfo.title}</h2>
            <a href={blogInfo.url}>{blogInfo.url}</a>
            <p>added by {blogInfo.name}</p>
            <br />
            <h3>comments</h3>
            <form>
                <div>
                    <label>
                        comment:
                        <input
                            value={newComment}
                            onChange={event => setNewComment(event.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <button type="submit" onClick={addComment}>add</button>
                </div>
            </form >
            {blogInfo.comments.map((comment, index) => <li key={index}>{comment}</li>)}
        </div>

    )
}
export default BlogDetail
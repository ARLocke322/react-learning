import { render, screen, within } from '@testing-library/react'
import Blog from './Blog'
import { test, expect, vi, beforeEach, describe } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
    let blog, likeBlog, deleteBlog
    beforeEach(() => {
        blog = {
            title: 'Component testing is done with react-testing-library',
            author: 'React',
            url: 'reactcomponent.com',
            likes: 0,
            user: {
                'username': 'test',
                'name': 'tester',
                'id': '68b9549fcb24346fb305107d'

            }
        }
        likeBlog = vi.fn()
        deleteBlog = vi.fn()
    })
    test('renders summary', async () => {
        render(<Blog blog={blog} user={blog.user} likeBlog={likeBlog} deleteBlog={deleteBlog} />)

        const blogInfo = screen.getByTestId('blog-summary')

        expect(within(blogInfo).getByText('Component testing is done with react-testing-library React')).toBeInTheDocument()

        // Should show view button
        expect(within(blogInfo).getByText('view')).toBeInTheDocument()

        // Should NOT show URL, likes, or delete button initially
        expect(within(blogInfo).queryByText('reactcomponent.com')).not.toBeInTheDocument()
        expect(within(blogInfo).queryByText('0')).not.toBeInTheDocument()
        expect(within(blogInfo).queryByText('like')).not.toBeInTheDocument()
    })
    test('renders details', async () => {
        render(<Blog blog={blog} user={blog.user} likeBlog={likeBlog} deleteBlog={deleteBlog} />)

        const blogInfo = screen.getByTestId('blog-details')

        expect(within(blogInfo).getByText('Component testing is done with react-testing-library React')).toBeInTheDocument()

        // Should show view button
        expect(within(blogInfo).getByText('hide')).toBeInTheDocument()

        // Should NOT show URL, likes, or delete button initially
        expect(within(blogInfo).getByText('reactcomponent.com')).toBeInTheDocument()
        expect(within(blogInfo).getByText('0')).toBeInTheDocument()
        expect(within(blogInfo).getByText('like')).toBeInTheDocument()
    })
    test('calls event handler twice when like button clicked twice', async () => {
        const user = userEvent.setup()
        render(<Blog blog={blog} user={blog.user} likeBlog={likeBlog} deleteBlog={deleteBlog} />)
        await user.click(screen.getByText('view'))
        await user.click(screen.getByText('like'))
        await user.click(screen.getByText('like'))
        expect(likeBlog.mock.calls).toHaveLength(2)
    })
})
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('blog API', () => {
    let testToken
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        await api
            .post('/api/users')
            .send({
                username: 'testuser',
                name: 'Test User',
                password: 'testpassword'
            })

        // Login and extract token
        const loginResponse = await api
            .post('/api/login')
            .send({
                username: 'testuser',
                password: 'testpassword'
            })

        testToken = loginResponse.body.token
    })

    describe('fetching blogs', async () => {
        test('blogs are returned as json', async () => {
            await api
                .get('/api/blogs')
                .expect(200)
                .expect('Content-Type', /application\/json/)
        })

        test('all blogs are returned', async () => {
            const response = await api.get('/api/blogs')

            assert.strictEqual(response.body.length, helper.initialBlogs.length)
        })

        test('a specific blog is within the returned blogs', async () => {
            const response = await api.get('/api/blogs')

            const url = response.body.map(e => e.url)
            assert(url.includes('https://reactpatterns.com/'))
        })

        test('a specific blog can be viewed', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToView = blogsAtStart[0]

            const resultBlog = await api.get(`/api/blogs/${blogToView.id}`).expect(200).expect('Content-Type', /application\/json/)
            assert.deepStrictEqual(resultBlog.body, blogToView)
        })
    })

    describe('creating blogs', () => {
        test('a valid blog can be added ', async () => {
            const newBlog = {
                title: 'New Blog',
                author: 'Alex',
                url: 'newblog.com',
                likes: 5
            }

            await api
                .post('/api/blogs')
                .set( 'Authorization', `Bearer ${testToken}` )
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

            const title = blogsAtEnd.map(n => n.title)
            assert(title.includes('New Blog'))
        })

        test('blog without title is not added', async () => {
            const newBlog = {
                author: 'Alex',
                url: 'newblog.com',
                likes: 5
            }

            await api
                .post('/api/blogs')
                .set( 'Authorization', `Bearer ${testToken}` )
                .send(newBlog)
                .expect(400)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })

        test('blog without token is not added', async () => {
            const newBlog = {
                title: 'New Blog',
                author: 'Alex',
                url: 'newblog.com',
                likes: 5
            }

            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(401)

            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('deleting blogs', () => {
        test('a blog can be deleted', async () => {
            const newBlog = {
                title: 'New Blog',
                author: 'Alex',
                url: 'newblog.com',
                likes: 5
            }

            await api
                .post('/api/blogs')
                .set( 'Authorization', `Bearer ${testToken}` )
                .send(newBlog)

            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart.at(-1)

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set( 'Authorization', `Bearer ${testToken}` )
                .expect(204)

            const blogsAtEnd = await helper.blogsInDb()

            const urls = blogsAtEnd.map(n => n.url)
            assert(!urls.includes(blogToDelete.url))

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
        })
    })

    describe('updating blogs', () => {
        test('a blog can be updated', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]

            const updatedBlog = {
                title: blogToUpdate.title,
                author: blogToUpdate.author,
                url: blogToUpdate.url,
                likes: blogToUpdate.likes + 1,
            }

            await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlog)
                .expect(200)

            const blogsAtEnd = await helper.blogsInDb()

            assert.strictEqual(blogsAtEnd[0].likes, helper.initialBlogs[0].likes + 1)
        })
    })
})

describe('user API', () => {
    describe('when there is initially one user in db', () => {
        beforeEach(async () => {
            await User.deleteMany({})
            await Blog.deleteMany({})

            const passwordHash = await bcrypt.hash('sekret', 10)
            const user = new User({ username: 'root', passwordHash })

            await user.save()
        })

        describe('user creation', () => {
            test('creation succeeds with a fresh username', async () => {
                const usersAtStart = await helper.usersInDb()

                const newUser = {
                    username: 'mluukkai',
                    name: 'Matti Luukkainen',
                    password: 'salainen',
                }

                await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect('Content-Type', /application\/json/)

                const usersAtEnd = await helper.usersInDb()
                assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

                const usernames = usersAtEnd.map(u => u.username)
                assert(usernames.includes(newUser.username))
            })

            test('creation fails with proper statuscode and message if username already taken', async () => {
                const usersAtStart = await helper.usersInDb()
                const newUser = {
                    username: 'root',
                    name: 'Superuser',
                    password: 'salainen',
                }

                const result = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)

                const usersAtEnd = await helper.usersInDb()
                assert(result.body.error.includes('expected `username` to be unique'))

                assert.strictEqual(usersAtEnd.length, usersAtStart.length)
            })
        })

        describe('user validation', () => {
            test('creation fails with proper statuscode and message if username is < 3 characters', async () => {
                const usersAtStart = await helper.usersInDb()
                const newUser = {
                    username: 'ab',
                    name: 'Alex',
                    password: 'password',
                }

                const result = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)

                const usersAtEnd = await helper.usersInDb()
                assert(result.body.error.includes('invalid username or password length'))

                assert.strictEqual(usersAtEnd.length, usersAtStart.length)
            })

            test('creation fails with proper statuscode and message if password is < 3 characters', async () => {
                const usersAtStart = await helper.usersInDb()
                const newUser = {
                    username: 'alex',
                    name: 'Alex',
                    password: 'ab',
                }

                const result = await api
                    .post('/api/users')
                    .send(newUser)
                    .expect(400)
                    .expect('Content-Type', /application\/json/)

                const usersAtEnd = await helper.usersInDb()
                assert(result.body.error.includes('invalid username or password length'))

                assert.strictEqual(usersAtEnd.length, usersAtStart.length)
            })
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})
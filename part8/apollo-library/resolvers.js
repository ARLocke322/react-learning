const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const {PubSub} = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
    Query: {
        bookCount: async () => Book.collection.countDocuments(),
        authorCount: async () => Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            const filter = {}
            if (args.author) {
                const author = await Author.findOne({ name: args.author })
                if (author) filter.author = author._id
            }
            if (args.genre) {
                filter.genres = args.genre
            }
                
            return Book.find(filter).populate('author')

        },
        allAuthors: async () => {
            console.log('Author.find')
            return Author.find({}).populate('authorOf')
        },
        me: async (root, args, context) => context.currentUser
    },
    Author: {
        bookCount: async (root) => Book.collection.countDocuments({ author: root._id })
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const currentUser = context.currentUser
            let savedBook
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
            const foundAuthor = await Author.findOne({ name: args.author })
            let book
            if (!foundAuthor) {
                const author = new Author({ name: args.author })
                await author.save()
                book = new Book({ ...args, author: author._id })

            } else {
                book = new Book({ ...args, author: foundAuthor._id })

            }
            try {
                savedBook = await book.save()
                
            } catch (error) {
                throw new GraphQLError('Saving book failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
            const populatedBook = await Book.findById(savedBook._id).populate('author')

            pubsub.publish('BOOK_ADDED', {bookAdded: populatedBook})

            return populatedBook
        },
        editAuthor: async (root, args, context) => {
            const currentUser = context.currentUser
            if (!currentUser) {
                throw new GraphQLError('not authenticated', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                    }
                })
            }
            try {
                return Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
            } catch (error) {
                throw new GraphQLError('Saving number failed', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        invalidArgs: args.name,
                        error
                    }
                })
            }
        },
        createUser: async (root, args) => {
            const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre})

            return user.save()
                .catch(error => {
                    throw new GraphQLError('Creating the user failed', {
                        extensions: {
                            code: 'BAD_USER_INPUT',
                            invalidArgs: args.username,
                            error
                        }
                    })
                })


        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })

            if (!user || args.password !== 'secret') {
                throw new GraphQLError('wrong credentials', {
                    extensions: {
                        code: 'BAD_USER_INPUT'
                    }
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }

        }
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
        }
    }
}

module.exports = resolvers
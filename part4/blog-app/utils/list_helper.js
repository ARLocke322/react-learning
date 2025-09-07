//const blog = require("../models/blog")
//const array = require('lodash/array')
//const object = require('lodash/fp/object')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return undefined
    return blogs.reduce((highest, blog) => {
        if (!highest) return blog
        else if (blog.likes > highest.likes) return blog
        else return highest
    })
}



const mostBlogs = (blogs) => {
    if (blogs.length === 0) return undefined

    const authorCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {})

    return Object.entries(authorCounts)
        .reduce((max, [author, count]) =>
            count > max.blogs ? { author, blogs: count } : max
        , { author: '', blogs: 0 })
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return undefined

    const authorCounts = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }, {})

    return Object.entries(authorCounts)
        .reduce((max, [author, count]) =>
            count > max.likes ? { author, likes: count } : max
        , { author: '', likes: 0 })
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
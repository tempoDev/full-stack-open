const lodash = require("lodash");

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    let total = 0
    blogs.map( post => {
        total += post.likes
    })
    
    return total
}

const mostLikes = (blogs) => {

    const likes = blogs.map( blog => blog.likes)
    const index = likes.indexOf( Math.max(...likes) )
    const post = blogs[index]

    return {
        title: post.title,
        author: post.author,
        url: post.url,
        likes: post.likes
    }

}

const mostBlogs = (blogs) => {

    if( blogs.lenght === 0 ) return null

    const counts = lodash.countBy(blogs, "author")

    const mostAuthor = Object.keys(counts).reduce( (a, b) => {
        return counts[a] > counts[b] ? a : b
    })

    return {
        author: mostAuthor,
        blogs: counts[mostAuthor]
    }
}

const mostLikesAuthor = (blogs) => {

    if( blogs.lenght === 0 ) return null

    const countLikes = lodash(blogs).groupBy("author")
    .map( (obj, key) => ({
        author: key,
        likes: lodash.sumBy(obj, "likes")
    })).value()

    return countLikes.reduce( (a, b) => {
        return a.likes > b.likes ? a : b
    })
}



module.exports = {
    dummy,
    totalLikes,
    mostLikes,
    mostBlogs,
    mostLikesAuthor
}
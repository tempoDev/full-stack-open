import { useSelector } from 'react-redux'
//import Blog from './Blog'
import { Link } from 'react-router-dom'

export default function BlogList() {

  const blogs = useSelector( state => state.blogs )

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <>
      <h2>Blogs</h2>

      { blogs.map( blog => (
        <div key={blog.id} style={blogStyle}>
          <Link to={`/blogs/${blog.id}`}>{blog.title} - {blog.author}</Link>
        </div>
      ))}
    </>
  )
}

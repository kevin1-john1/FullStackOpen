import { Link } from 'react-router-dom'

const Menu = ({ user, handleLogout }) => {
  return (
    <div className="menu">
      <Link to="/">blogs</Link>
      <Link to="/users">users</Link>

      <span>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>logout</button>
      </span>
    </div>
  )
}

export default Menu
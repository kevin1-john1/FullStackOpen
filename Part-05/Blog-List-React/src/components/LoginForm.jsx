const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          data-testid="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>

      <div>
        password
        <input
          data-testid="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
import useField from '../hooks/useField'

const LoginForm = ({ handleLogin }) => {
  const username = useField('text')
  const password = useField('password')

  const login = event => {
    event.preventDefault()

    handleLogin({
      username: username.input.value,
      password: password.input.value,
    })

    username.reset()
    password.reset()
  }

  return (
    <form onSubmit={login}>
      <div>
        username
        <input data-testid="username" {...username.input} />
      </div>

      <div>
        password
        <input data-testid="password" {...password.input} />
      </div>

      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
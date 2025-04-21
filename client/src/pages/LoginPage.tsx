import { SetToken } from '../types/auth'

type LoginPageProps = {
	setToken: SetToken
}

const LoginPage = ({ setToken }: LoginPageProps) => {
	return <h1>Страница входа</h1>
}

export default LoginPage

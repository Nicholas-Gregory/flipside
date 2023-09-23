import CreateAccountForm from "../CreateAccountForm/CreateAccountForm";
import LoginForm from "../LoginForm/LoginForm";

export default function AuthenticateUser({ authenticate, createAccount, errors }) {
    async function handleCreateAccountSubmit(username, password, email) {
        await createAccount(username, email, password);
    }

    async function handleLoginSubmit(usernameOrEmail, password) {
        await authenticate(usernameOrEmail, usernameOrEmail, password);
    }

    return (
        <>
            <h2>
                Sign In
            </h2>
            <LoginForm onSubmit={handleLoginSubmit} />
            <h2>
                Create Account
            </h2>
            <CreateAccountForm onSubmit={handleCreateAccountSubmit} />
            {errors && <>
                <p>There was an error authenticating your account</p>
                <ul>
                    {errors.map((error, index) => 
                        <li key={index}>
                            {error.message}
                        </li>
                    )}
                </ul>
            </>}
        </>
    )
}
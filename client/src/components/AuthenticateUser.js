import CreateAccountForm from "./CreateAccountForm";
import LoginForm from "./LoginForm";

export default function AuthenticateUser({ authenticate, createAccount, errors }) {
    async function handleCreateAccountSubmit(username, password, email) {
        await createAccount(username, email, password);
    }

    async function handleLoginSubmit(usernameOrEmail, password) {
        await authenticate(usernameOrEmail, usernameOrEmail, password);
    }

    return (
        <>
            <div id='authForms'>
            <h1>
                Welcome to Flipside!
            </h1>
            <h2>
                Sign in or create an account
            </h2>
                <LoginForm onSubmit={handleLoginSubmit} />
                <CreateAccountForm onSubmit={handleCreateAccountSubmit} />
            </div>
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
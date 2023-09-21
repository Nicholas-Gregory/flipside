import { useState } from 'react';

export default function LoginForm({ onSubmit }) {
    const [usernameOrEmailInput, setUsernameOrEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        setUsernameOrEmailInput('');
        setPasswordInput('');

        onSubmit(usernameOrEmailInput, passwordInput);
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username or Email</label>
                <input 
                    type="text"
                    name="username"
                    placeholder="Enter Username or Email"
                    value={usernameOrEmailInput}
                    onChange={e => setUsernameOrEmailInput(e.target.value)}
                />
                <label htmlFor='password'>Password</label>
                <input 
                    type="text"
                    name='password'
                    placeholder='Enter Password'
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                />

            <button>Submit</button>
            </form>
        </>
    )
}
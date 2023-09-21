import { useState } from "react";

export default function CreateAccountForm({ onSubmit }) {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [emailInput, setEmailInput] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        if (passwordInput !== confirmPasswordInput) return;

        onSubmit(usernameInput, passwordInput, emailInput);

        setUsernameInput('');
        setPasswordInput('');
        setConfirmPasswordInput('');
        setEmailInput('');
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Choose a Username</label>
                <input
                    type='text'
                    name='username'
                    placeholder="Username"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                />
                <label htmlFor="password">Choose a Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input  
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={confirmPasswordInput}
                    onChange={e => setConfirmPasswordInput(e.target.value)}
                />
                <label htmlFor='email'>Enter Email</label>
                <input 
                    type='text'
                    name='email'
                    placeholder="Email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                />
            </form>
            {passwordInput !== confirmPasswordInput && <p><i>Passwords do not match</i></p>}
            {emailInput !== '' && !/^[\w-.!#$&'*+=?^`{}|~/]+@([\w-]+\.)+[\w-]{2,}$/.test(emailInput) && <p><i>Not a valid email address</i></p>}
        </>
    )
}
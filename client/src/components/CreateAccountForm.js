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
        <div className='formContainer'>
            <form 
                onSubmit={handleSubmit}
                className="form"
            >
                <h2 className="formTitle">
                    Create Account
                </h2>
                <div className='formItem'>
                    <label htmlFor="username">Choose a Username</label>
                    <input
                        type='text'
                        name='username'
                        placeholder="Username"
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}
                    />
                </div>
                <div className='formItem'>
                    <label htmlFor="password">Choose a Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                    />
                </div>
                <div className='formItem'>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input  
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm"
                        value={confirmPasswordInput}
                        onChange={e => setConfirmPasswordInput(e.target.value)}
                    />
                </div>
                <div className='formItem'>
                    <label htmlFor='email'>Enter Email</label>
                    <input 
                        type='text'
                        name='email'
                        placeholder="Email"
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                    />
                </div>
            <button className="formSubmitButton">Create Account</button>
            </form>
            {passwordInput !== confirmPasswordInput && <p><i>Passwords do not match</i></p>}
            {emailInput !== '' && !/^[\w-.!#$&'*+=?^`{}|~/]+@([\w-]+\.)+[\w-]{2,}$/.test(emailInput) && <p><i>Not a valid email address</i></p>}
        </div>
    )
}
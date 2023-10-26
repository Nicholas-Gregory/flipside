import { useState } from 'react';

export default function LoginForm({ onSubmit }) {
    const [usernameOrEmailInput, setUsernameOrEmailInput] = useState("");
    const [passwordInput, setPasswordInput] = useState('');

    function handleSubmit(e) {
        e.preventDefault();

        onSubmit(usernameOrEmailInput, passwordInput);

        setUsernameOrEmailInput('');
        setPasswordInput('');
    }

    return (
        <div className='formContainer'>
            <form 
                className="form" 
                onSubmit={handleSubmit}
            >
                 <h2 className='formTitle'>
                    Sign In
                </h2>
                <div className='formItem'>
                    <label htmlFor="usernameOrEmail">Username or Email</label>
                    <input 
                        type="text"
                        name="usernameOrEmail"
                        placeholder="Enter Username or Email"
                        value={usernameOrEmailInput}
                        onChange={e => setUsernameOrEmailInput(e.target.value)}
                    />
                </div>
                <div className='formItem'>
                    <label htmlFor='password'>Password</label>
                    <input 
                        type="password"
                        name='password'
                        placeholder='Enter Password'
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                    />
                </div>
                <button className='formSubmitButton'>Submit</button>
            </form>
            <p>
                Privacy Policy: <br />
                As this is a test deployment, all data is subject to deletion at any time, and all data can be deleted upon request. <br />
                No data of any kind will be shared with any other party at any time.
            </p>
        </div>
    )
}
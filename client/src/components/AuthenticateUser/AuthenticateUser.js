import { useState } from 'react';

import CreateAccountForm from "../CreateAccountForm/CreateAccountForm";
import LoginForm from "../LoginForm/LoginForm";

import { query } from "../../utils";

export default function AuthenticateUser({ onAuth }) {
    const [errors, setErrors] = useState(null);

    async function login(username, email, password) {
        const response = await query(`
            query Login($username: String, $email: String, $password: String!) {
                login(username: $username, email: $email, password: $password)
            }
        `, {
            username, email, password
        });

        if (response.errors) {
            setErrors(response.errors);
            return;
        } else {
            setErrors(null);
        }

        return response.data.login;
    }

    async function handleCreateAccountSubmit(username, password, email) {
        const results = await query(`
            mutation AddUser($username: String!, $email: String!, $password: String!) {
                addUser(username: $username, email: $email, password: $password) {
                    id
                }
            }
        `, {
            username, password, email
        });
        
        if (results.errors) {
            setErrors(results.errors);
            return;
        } else {
            setErrors(null);
        }

        const token = await login(username, email, password);
        console.log(token);
    }

    function handleLoginSubmit(usernameOrEmail, password) {
        
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
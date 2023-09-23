import { useState } from 'react';

import CreateAccountForm from "../CreateAccountForm/CreateAccountForm";
import LoginForm from "../LoginForm/LoginForm";

import { query } from "../../utils";
import useAuth from '../../hooks/useAuth';

export default function AuthenticateUser({ onAuth }) {
    const { authenticate, errors } = useAuth();

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

        authenticate(username, email, password);
        onAuth()
    }

    async function handleLoginSubmit(usernameOrEmail, password) {
        authenticate(usernameOrEmail, usernameOrEmail, password);
        onAuth();
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
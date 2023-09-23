import { useState, useEffect } from "react";
import { auth, query } from "../utils";

export default function useAuth() {
    const [loggedIn, setLoggedIn] = useState(null);
    const [errors, setErrors] = useState(null);

    async function authorize() {
        const token = localStorage.getItem("flipside.authToken");

        if (token) setLoggedIn(await auth(token));
    }

    useEffect(() => { authorize() }, []);

    async function authenticate(username, email, password) {
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

        const token = response.data.login;

        localStorage.setItem('flipside.authToken', token);
        setLoggedIn(await auth(token));
    }

    async function createAccount(username, email, password) {
        const response = await query(`
        mutation AddUser($username: String!, $email: String!, $password: String!) {
            addUser(username: $username, email: $email, password: $password) {
                id
            }
        }
        `, {
            username, email, password
        });

        if (response.errors) {
            setErrors(response.errors);
            return
        } else {
            setErrors(null);
        }

        await authenticate(username, email, password);
    }

    return { 
        loggedIn, 
        authenticate, 
        authorize, 
        createAccount, 
        errors 
    };
}
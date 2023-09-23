import { useState, useEffect } from "react";
import { auth, query } from "../utils";

export default function useAuth() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("flipside.authToken");

        if (token) (async () => setLoggedIn(await auth(token)))();
    }, []);

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

        localStorage.setItem('flipside.authToken', response.data.login);
        setLoggedIn(true);
    }

    return { loggedIn, authenticate, errors };
}
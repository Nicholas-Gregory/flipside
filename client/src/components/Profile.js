import { useEffect, useState } from 'react';
import { query } from '../utils';
export default function Profile({ loggedIn }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        query(`
            query User($id: String!) {
                userById(id: $id) {
                    username,
                    email,
                    bio,
                    friends {
                        username
                    },
                    incomingFriendRequests {
                        username
                    },
                    conversations {
                        id,
                        title,
                        participants {
                            username
                        }
                    }
                }
            }
        `, { id: loggedIn }).then(response => setCurrentUser(response.data.userById));
    }, []);
}
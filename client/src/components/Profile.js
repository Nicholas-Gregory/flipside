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

    return (
        <>
            <h1>
                {currentUser.username}'s Profile
            </h1>
            <div id='profileFlexContainer'>
                <div className='profileDiv'>
                    <h2>
                        Conversations
                    </h2>
                </div>
                <div className='profileDiv'>
                    <h2>
                        Info
                    </h2>
                </div>
            </div>
        </>
    )
}
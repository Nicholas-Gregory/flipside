import { useState } from "react";
import BrowseConversations from "./BrowseConversations";
import NewConversation from "./NewConversation";
import Profile from "./Profile";
import { useEffect } from 'react';

import { query } from '../utils'

export default function Dashboard({ loggedIn, currentPage }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [bioFlip, setBioFlip] = useState(false);

    async function updateBio(bio, token) {
        await query(`
            mutation UpdateBio($bio: String!, $token: String!) {
                updateBio(bio: $bio, token: $token) {
                    bio
                }
            }
        `, { bio, token});

        setBioFlip(!bioFlip);
    }

    useEffect(() => {
        query(`
            query User($id: String!) {
                userById(id: $id) {
                    id,
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
                        title,
                        topics,
                        participants {
                            username
                        }
                    }
                }
            }
        `, { id: loggedIn }).then(response => setCurrentUser(response.data.userById))
    }, [bioFlip]);

    if (currentPage === 'browse') {
        return <BrowseConversations />
    } else if (currentPage === 'profile') {
        return <Profile 
                loggedIn={loggedIn}
                user={currentUser}
                updateBio={updateBio}
            />
    } else if (currentPage === 'start') {
        return <NewConversation 
                loggedIn={loggedIn}
                onCreate={() => setBioFlip(!bioFlip)}
               />
    }
}
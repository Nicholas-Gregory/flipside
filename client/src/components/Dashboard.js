import { useState } from "react";
import BrowseConversations from "./BrowseConversations";
import NewConversation from "./NewConversation";
import Profile from "./Profile";
import { useEffect } from 'react';

import { query } from '../utils'
import ViewConversation from "./ViewConversation";

const conversationQuery = `
query Conversation($id: String!) {
    conversationById(id: $id) {
        id,
        title,
        topics,
        remarks {
            id,
            author {
                id
            },
            body,
            comments {
                id, body
            }
        },
        participants {
            username,
            id
        }
    }
}
`;

export default function Dashboard({ loggedIn, currentPage, onSelectConversation }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [bioFlip, setBioFlip] = useState(false);
    const [currentConversation, setCurrentConversation] = useState(null);

    async function updateBio(bio) {
        await query(`
            mutation UpdateBio($bio: String!) {
                updateBio(bio: $bio) {
                    bio
                }
            }
        `, { bio });

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
                        id,
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

    async function handleCreate(id) {
        setBioFlip(!bioFlip);

        const response = await query(conversationQuery, { id });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setCurrentConversation(response.data.conversationById);

        onSelectConversation(id);
    }

    async function handleSelectConversation(id) {
        const response = await query(conversationQuery, { id });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setCurrentConversation(response.data.conversationById);

        onSelectConversation(id);
    }

    async function handleAddRemark(newRemark) {
        const response = await query(`
            mutation AddRemark($conversationId: String!, $body: String!, $authorId: String!) {
                addRemark(conversationId: $conversationId, body: $body, authorId: $authorId) {
                    id
                }
            }
        `, { 
            conversationId: currentConversation.id,
            body: newRemark,
            authorId: loggedIn
        });

        if(response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setCurrentConversation((await query(conversationQuery, { id: currentConversation.id })).data.conversationById);
    }

    async function handleSaveComment(body, remarkId) {
        const response = await query(`
            mutation AddComment($remarkId: String!, $body: String!) {
                addComment(remarkId: $remarkId, body: $body) {
                    id
                }
            }
        `, { remarkId, body });

        if(response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setCurrentConversation((await query(conversationQuery, { id: currentConversation.id })).data.conversationById);
    }

    async function handleAddPeople(input) {
        const response = await query(`
            mutation AddUsers($conversationId: String!, $usernames: [String]!) {
                addUsersToConversationByUsername(conversationId: $conversationId, usernames: $usernames) {
                    id,
                    title,
                    topics,
                    remarks {
                        id,
                        author {
                            id
                        },
                        body,
                        comments {
                            id, body
                        }
                    },
                    participants {
                        username,
                        id
                    }
                }
            }
        `, {
            conversationId: currentConversation.id,
            usernames: input.split(',').map(user => user.trim())
        });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setCurrentConversation(response.data.addUsersToConversationByUsername);
        setBioFlip(!bioFlip);
    }

    if (currentPage === 'browse') {
        return <BrowseConversations />
    } else if (currentPage === 'profile') {
        return <Profile 
                loggedIn={loggedIn}
                user={currentUser}
                updateBio={updateBio}
                onSelectConversation={handleSelectConversation}
            />
    } else if (currentPage === 'start') {
        return <NewConversation 
                loggedIn={loggedIn}
                onCreate={handleCreate}
               />
    } else if (currentPage === 'view') {
        return <ViewConversation
                loggedIn={loggedIn}
                conversation={currentConversation}
                onAddRemark={handleAddRemark}
                onSaveComment={handleSaveComment}
                onAddPeople={handleAddPeople}
               />
    }
}
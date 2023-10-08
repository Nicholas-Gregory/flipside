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
                id, username
            },
            body,
            comments {
                id, body, author
            },
            citations {
                id, text, body, link
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
                            id, username
                        },
                        body,
                        comments {
                            id, body, author
                        },
                        citations {
                            id, text, body, link
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

    async function handleSubmitCitation(remarkId, text, body, link) {
        const response = await query(`
            mutation AddCitation($remarkId: String!, $text: String!, $body: String!, $link: String) {
                addCitation(remarkId: $remarkId, text: $text, body: $body, link: $link) {
                    id
                }
            }
        `, { remarkId, text, body, link});

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setCurrentConversation((await query(conversationQuery, { id: currentConversation.id })).data.conversationById);
    }

    async function handleSelectCitationText(remarkId, selection) {
        const anchorNode = selection.anchorNode;
        const focusNode = selection.focusNode;
        const firstChild = anchorNode.parentNode.parentNode.firstChild;
        let lastNodePosition;

        let counterNode = firstChild;

        // get anchor node position
        let anchorNodePosition = 0;
        while (counterNode.firstChild !== anchorNode) {
            anchorNodePosition++;
            counterNode = counterNode.nextSibling;
        }

        counterNode = firstChild;

        // get focus node position
        let focusNodePosition = 0;
        while (counterNode.firstChild !== focusNode) {
            focusNodePosition++;
            counterNode = counterNode.nextSibling;
        }

        // get position of whichever node is last
        if (anchorNodePosition < focusNodePosition) {
            lastNodePosition = focusNodePosition;
        } else if (anchorNodePosition > focusNodePosition) {
            lastNodePosition = anchorNodePosition;
        }

        // compute character-wise offset
        let offset = 0;
        let counter = 0;
        counterNode = firstChild;
        while (counter <= lastNodePosition) {
            counter++;
            if (counterNode.nodeName === 'PRE') {
                offset++;
            } else {
                offset += 3;
            }
            counterNode = counterNode.nextSibling;
        }

        const remark = currentConversation.remarks.find(r => r.id === remarkId)
        const numberOfCitations = remark.citations ? remark.citations.length : 0;
        const remarkBody = remark.body;
        const newBody = remarkBody.split('').toSpliced(offset, 0, `[${numberOfCitations + 1}]`).join('');        

        const response = await query(`
            mutation AddCitationMarker($remarkId: String!, $newBody: String!) {
                updateRemarkBody(remarkId: $remarkId, newBody: $newBody) {
                    id
                }
            }
        `, { remarkId, newBody });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setCurrentConversation((await query(conversationQuery, { id: currentConversation.id })).data.conversationById);
    }

    function handleBrowseSelection(conversationId) {
        handleSelectConversation(conversationId)
    }

    if (currentPage === 'browse') {
        return <BrowseConversations 
                onSelectConversation={handleBrowseSelection}
            />
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
                onSubmitCitation={handleSubmitCitation}
                onSelectCitationText={handleSelectCitationText}
               />
    }
}
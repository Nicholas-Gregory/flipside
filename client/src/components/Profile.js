import { useState, useEffect } from 'react';

import { query } from '../utils';
import useAuth from '../hooks/useAuth';

import ConversationCardList from './ConversationCardList';

export default function Profile({ 
    loggedIn, 
    user, 
    updateBio,
    onSelectConversation
}) {
    const [editing, setEditing] = useState(false);
    const [editingBio, setEditingBio] = useState(null);

    useEffect(() => { setEditingBio(user?.bio)}, [user]);

    async function handleSaveChanges(e) {
        await updateBio(editingBio);

        setEditing(false);
    }

    function handleSelectConversation(id) {
        onSelectConversation(id)
    }

    return (
         <>{user && <>
            <h1>
                {user.username}'s Profile
            </h1>
            <div id='profileFlexContainer'>
                <div className='profileDiv'>
                    <div className='card'>
                        <h2>
                            Conversations
                        </h2>
                        {user.conversations.length > 0 ? 
                        <ConversationCardList 
                            conversations={user.conversations} 
                            onSelect={handleSelectConversation}
                        /> : "This user is not involved in any conversations"}
                    </div>
                </div>
                <div className='profileDiv'>
                    <div className='card'>
                        <h2>
                            Info
                        </h2>
                        <h3>
                            About {user.username}
                        </h3>
                        {!editing && 
                            <p>
                                {user.bio}
                            </p>
                        }
                        {editing &&
                            <textarea
                                value={editingBio}
                                onChange={e => setEditingBio(e.target.value)}
                            />
                        }
                        {loggedIn === user.id && !editing &&
                            <button onClick={() => setEditing(true)}>Edit Bio</button>
                        }
                        {editing &&
                            <button onClick={handleSaveChanges}>Save Changes</button>
                        }
                    </div>
                </div>
            </div>
        </>}</>
    )
}
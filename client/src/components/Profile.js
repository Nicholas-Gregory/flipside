import { useState } from 'react';

import { query } from '../utils';
import useAuth from '../hooks/useAuth';

import ConversationCardList from './ConversationCardList';

export default function Profile({ loggedIn, user, updateBio }) {
    const [editing, setEditing] = useState(false);
    const [editingBio, setEditingBio] = useState(null);
    const { authorize, errors } = useAuth();

    async function handleSaveChanges(e) {
        const token = await authorize();

        if (errors) {
            alert(errors);
            return;
        }

        await updateBio(editingBio, token);

        setEditing(false);
    }

    return (
         <>{user && <>
            <h1>
                {user.username}'s Profile
            </h1>
            <div id='profileFlexContainer'>
                <div className='profileDiv'>
                    <h2>
                        Conversations
                    </h2>
                    {user.conversations.length > 0 ? <ConversationCardList conversations={user.conversations} /> : "This user is not involved in any conversations"}
                </div>
                <div className='profileDiv'>
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
        </>}</>
    )
}
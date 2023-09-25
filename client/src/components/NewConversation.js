import { useState } from 'react';
import { query } from '../utils';

export default function NewConversation({ loggedIn }) {
    const [titleInput, setTitleInput] = useState('');
    const [topicsInput, setTopicsInput] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();

        const topics = topicsInput.split(',').map(t => t.trim());

        const response = await query(`
            mutation AddConversation($title: String, $participantIds: [String], $topics: [String]) {
                addConversation(title: $title, participantIds: $participantIds, topics: $topics) {
                    id
                }
            }
        `, { 
            title: titleInput, 
            topics, 
            participantIds: [loggedIn] 
        });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }
    }

    return (
        <>   
            <div className='formContainer'>
                <form 
                    onSubmit={handleSubmit}
                    className="form"
                >
                    <h2>Create New Conversation</h2>
                    <div className='formItem'>
                        <label htmlFor='title'>Enter conversation title:</label>
                        <input
                            type='text'
                            name='title'
                            placeholder="Title"
                            value={titleInput}
                            onChange={e => setTitleInput(e.target.value)}
                        />
                    </div>
                    <div className='formItem'>
                        <label htmlFor='topics'>Enter topics, separated by commas:</label>
                        <textarea
                            type='text'
                            name='title'
                            placeholder='Topics'
                            value={topicsInput}
                            onChange={e => setTopicsInput(e.target.value)}
                        />
                    </div>
                    <button>Create</button>
                </form>
            </div>
        </>
    )
}
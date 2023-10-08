import { useState, useEffect } from "react";
import { query } from "../utils";
import ConversationCardList from "./ConversationCardList";

export default function BrowseConversations({ onSelectConversation }) {
    const [conversations, setConversations] = useState([]);
    const [displayedConversations, setDisplayedConversations] = useState([]);
    const [titleSearch, setTitleSearch] = useState('');

    useEffect(() => {
        (async () => {
            const loadedConversations = (await query(`
                {
                    conversations {
                        id, title, topics,
                        participants {
                            username
                        }
                    }
                }
            `)).data.conversations
            setConversations(loadedConversations);
            setDisplayedConversations(loadedConversations);
        })();
    }, []);

    function handleSelect(conversationId) {
        onSelectConversation(conversationId);
    }

    function handleSearchByTitle(e) {
        e.preventDefault();
        setTitleSearch('');
        setDisplayedConversations(conversations.filter(c => c.title === titleSearch));
    }

    return (
        <>
            <button onClick={() => setDisplayedConversations(conversations)}>View All</button>
            <form onSubmit={handleSearchByTitle}>
                <input
                    type="text"
                    value={titleSearch}
                    onChange={e => setTitleSearch(e.target.value)}
                    placeholder="Search by Title"
                />
            </form>
            <ConversationCardList 
                conversations={displayedConversations} 
                onSelect={handleSelect} 
            />
        </>
    );
}
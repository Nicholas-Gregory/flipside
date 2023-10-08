import { useState, useEffect } from "react";
import { query } from "../utils";
import ConversationCardList from "./ConversationCardList";

export default function BrowseConversations({ onSelectConversation }) {
    const [conversations, setConversations] = useState([]);
    const [displayedConversations, setDisplayedConversations] = useState([]);
    const [titleSearch, setTitleSearch] = useState('');
    const [topicSearch, setTopicSearch] = useState('');

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

        setDisplayedConversations(conversations.filter(c => c.title === titleSearch));

        setTitleSearch('');
    }

    function handleTopicSearch(e) {
        e.preventDefault();

        const topics = topicSearch.split(',').map(t => t.trim());
        setDisplayedConversations(conversations.filter(c => c.topics.some(t => topics.includes(t))))

        setTopicSearch('')
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
            <form onSubmit={handleTopicSearch}>
                <input
                    type="text"
                    value={topicSearch}
                    onChange={e => setTopicSearch(e.target.value)}
                    placeholder="Search by topic(s), separated by spaces"
                    size={39}
                />
            </form>
            <ConversationCardList 
                conversations={displayedConversations} 
                onSelect={handleSelect} 
            />
        </>
    );
}
import { useState, useEffect } from "react";
import { query } from "../utils";
import ConversationCardList from "./ConversationCardList";

export default function BrowseConversations({ onSelectConversation }) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        (async () => 
            setConversations((await query(`
                {
                    conversations {
                        id, title, topics,
                        participants {
                            username
                        }
                    }
                }
            `)).data.conversations)
        )();
    }, []);

    function handleSelect(conversation) {
        onSelectConversation(conversation);
    }

    return (
        <ConversationCardList conversations={conversations} onSelect={handleSelect} />
    );
}
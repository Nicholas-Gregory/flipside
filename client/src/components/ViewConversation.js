export default function ViewConversation({ loggedIn, conversation }) {
    return (
        <>
            <h1>
                Conversation
            </h1>
            <h2>
                {conversation.title}
            </h2>
            <h3>
                Topics
            </h3>
            <ul>
                {conversation.topics.map(topic =>
                    <li>
                        {topic}
                    </li>    
                )}
            </ul>
        </>
    )
}
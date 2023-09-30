export default function ConversationCardList({ conversations, onSelect }) {
    return (
        <ul>
            {conversations.map(conversation =>
                <li key={conversation.id}>
                    <button onClick={() => onSelect(conversation.id)}><em>{conversation.title}</em><br/></button>
                    <p>
                        Topics:
                    </p>
                    <ul>
                        {conversation.topics.map((topic, index) =>
                            <li key={index}>
                                {topic}
                            </li>    
                        )} 
                    </ul>
                    <p>
                        Participants:
                    </p>
                    <ul>
                        {conversation.participants.map((participant, index) =>
                            <li key={index}>
                                {participant.username}
                            </li>    
                        )}
                    </ul>
                </li>
            )}
        </ul>
    )
}
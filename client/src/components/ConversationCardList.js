export default function ConversationCardList({ conversations, onSelect }) {
    return (
        <ul style={{ listStyleType: 'none' }}>
            {conversations.map(conversation =>
                <li className="card" key={conversation.id}>
                    <button onClick={() => onSelect(conversation.id)}><em>{conversation.title}</em><br/></button>
                    <p>
                        Topics:
                    </p>
                    <ul>
                        {conversation.topics.map((topic, index) =>
                            <li key={index} className="conversationTagLi">
                                {topic}
                            </li>    
                        )} 
                    </ul>
                    <p>
                        Participants:
                    </p>
                    <ul>
                        {conversation.participants.map((participant, index) =>
                            <li key={index} className="conversationTagLi">
                                {participant.username}
                            </li>    
                        )}
                    </ul>
                </li>
            )}
        </ul>
    )
}
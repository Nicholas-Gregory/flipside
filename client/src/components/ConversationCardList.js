export default function ConversationCardList({ conversations }) {
    return (
        <ul>
            {conversations.map(conversation =>
                <li key={conversation.id}>
                    <em>{conversation.title}</em><br/>
                    <p>
                        Topics:
                    </p>
                    <ul>
                        {conversation.topics.map(topic =>
                            <li>
                                topic
                            </li>    
                        )} 
                    </ul>
                    <p>
                        Participants:
                    </p>
                    <ul>
                        {conversation.participants.map(participant =>
                            <li>
                                participant.username
                            </li>    
                        )}
                    </ul>
                </li>
            )}
        </ul>
    )
}
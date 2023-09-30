import { useState } from "react";
import Remark from "./Remark";

export default function ViewConversation({ loggedIn, conversation, onAddRemark, onSaveComment }) {
    const [composing, setComposing] = useState(false);
    const [newRemark, setNewRemark] = useState('');

    function handleSaveRemarkClick() {
        onAddRemark(newRemark);
        setNewRemark('');
        setComposing(false);
    }

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
            <h1>
                Remarks
            </h1>
            <ul>
                {conversation.remarks.map(remark =>
                    <li key={remark.id}>
                        <Remark 
                            remark={remark} 
                            onSaveComment={(body, remarkId) => onSaveComment(body, remarkId)} 
                        />
                    </li>    
                )}
            </ul>
            {loggedIn && !composing && <button onClick={() => setComposing(true)}>Add Remark</button>}
            {composing && <>
                <textarea 
                    value={newRemark}
                    onChange={e => setNewRemark(e.target.value)}
                />
                <button onClick={handleSaveRemarkClick}>Save</button>
            </>}
        </>
    )
}
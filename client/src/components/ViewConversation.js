import { useEffect, useState } from "react";
import Remark from "./Remark";
import CitationCard from "./CitationCard";

export default function ViewConversation({ 
    loggedIn, 
    conversation, 
    onAddRemark, 
    onSaveComment, 
    onAddPeople, 
    onSubmitCitation,
    onSelectCitationText
}) {
    const [composing, setComposing] = useState(false);
    const [newRemark, setNewRemark] = useState('');
    const [addingPeople, setAddingPeople] = useState(false);
    const [addPeopleInput, setAddPeopleInput] = useState('');
    const [displayedCitations, setDisplayedCitations] = useState([]);
    

    function handleSaveRemarkClick() {
        onAddRemark(newRemark);
        setNewRemark('');
        setComposing(false);
    }

    function handleAddPeopleClick() {
        setAddingPeople(true);
    }

    async function handleAddClick() {
        setAddingPeople(false);
        onAddPeople(addPeopleInput)
    }
    
    function handleSubmitCitation(remarkId, text, body, link) {
        onSubmitCitation(remarkId, text, body, link);
    }

    function handleSelectCitationText(remarkId, selection) {
        onSelectCitationText(remarkId, selection)
    }

    function handleCitationClick(remarkId, citationIndex) {
        const remark = conversation.remarks.find(r => r.id === remarkId);
        
        setDisplayedCitations([...displayedCitations, remark.citations[citationIndex]]);
    }

    function handleCitationClose(citationId) {
        setDisplayedCitations(displayedCitations.filter(c => c.id !== citationId));
    }

    return (
        <>{conversation && 
            <div style={{ display: 'flex' }}>
                <div className="card conversationContainer">
                    <h1>
                        Conversation
                    </h1>
                    <div className="card">                 
                        <h2>
                            {conversation.title}
                        </h2>
                        <h3>
                            Topics
                        </h3>
                        <ul style={{ listStyleType: "none" }}>
                            {conversation.topics.map((topic, index) =>
                                <li key={index} className="conversationTagLi">
                                    {topic}
                                </li>    
                            )}
                        </ul>
                        <h3>
                            Participants
                        </h3>
                        <ul style={{ listStyleType: "none" }}>
                            {conversation.participants.map((participant, index) => 
                                <li className="conversationTagLi" key={participant.id}>
                                    <span>{participant.username}</span>
                                </li>
                            )}
                        </ul>
                        {loggedIn && !addingPeople &&
                            <button onClick={handleAddPeopleClick}>Add People</button>
                        }
                        {addingPeople && <>
                            <p>
                                Type the usernames of the people you wish to add, separated by commas
                            </p>
                            <textarea
                                value={addPeopleInput}
                                onChange={e => setAddPeopleInput(e.target.value)}
                            />
                            <button onClick={handleAddClick}>Add</button>
                        </>}
                    </div>
                    <h1>
                        Remarks
                    </h1>
                    <div className="card">
                        <ul className="remarkList">
                            {conversation.remarks.map(remark =>
                                <li key={remark.id} className="remarkLi">
                                    <Remark 
                                        loggedIn={loggedIn}
                                        remark={remark} 
                                        onSaveComment={(body, remarkId) => onSaveComment(body, remarkId)}
                                        onSubmitCitation={handleSubmitCitation} 
                                        onSelectCitationText={handleSelectCitationText}
                                        onCitationClick={handleCitationClick}
                                    />
                                    
                                </li>    
                            )}
                        </ul>
                        {conversation.participants
                        .map(p => p.id)
                        .includes(loggedIn) && !composing && <button onClick={() => setComposing(true)}>Add Remark</button>}
                    </div>
                    {composing && <>
                        <textarea 
                            value={newRemark}
                            onChange={e => setNewRemark(e.target.value)}
                        />
                        <button onClick={handleSaveRemarkClick}>Save</button>
                        <button onClick={() => setComposing(false)}>Cancel</button>
                    </>}
                </div>
                <div className="card">
                    <h1>
                        Citations
                    </h1>
                    {displayedCitations.length > 0 ?
                        displayedCitations.map((citation, index) => 
                            <CitationCard 
                                key={index} 
                                citation={citation} 
                                onClose={handleCitationClose}
                            />    
                        )
                        :
                        <p>Click a citation's subscript number to display it here</p>
                    }
                </div>
            </div>
        }</>
    )
}
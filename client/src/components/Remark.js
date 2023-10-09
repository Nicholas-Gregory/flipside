import { useState } from "react"
import CommentList from "./CommentList";

export default function Remark({ remark, onSaveComment, onSubmitCitation, onSelectCitationText, onCitationClick }) {
    const [showComments, setShowComments] = useState(false);
    const [composing, setComposing] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [citationStage, setCitationStage] = useState('default');
    const [citationBodyInput, setCitationBodyInput] = useState('');
    const [citationLinkInput, setCitationLinkInput] = useState('');
    const [citationText, setCitationText] = useState('');

    function handleSelectClick() {
        setCitationStage('composing');

        const selection = window.getSelection();
        setCitationText(selection.toString());

        onSelectCitationText(remark.id, selection);
    }

    function handleCitationFormSubmit(e) {
        e.preventDefault();
        setCitationStage('default');

        console.log(citationText);

        onSubmitCitation(remark.id, citationText, citationBodyInput, citationLinkInput);

        setCitationText('');
        setCitationBodyInput('');
        setCitationLinkInput('');
    }

    function handleSaveCommentClick() {
        onSaveComment(newComment, remark.id);
        setComposing(false);
        setNewComment('');
    }

    function citationMarkup() {
        switch (citationStage) {
            case 'default':
                return <button onClick={() => setCitationStage('selecting')}>Add Citation</button>;
            case 'selecting':
                return <p>
                    Select the text you want to add the citation to and click <button onClick={handleSelectClick}>here.</button>
                </p>
            case 'composing':
                return (
                    <form onSubmit={handleCitationFormSubmit}>
                        <label htmlFor="citationBody">Enter citation body</label>
                        <input
                            name="citationBody"
                            value={citationBodyInput}
                            onChange={e => setCitationBodyInput(e.target.value)}
                        />
                        <label htmlFor="citationLink">Enter citation link</label>
                        <input
                            name="citationLink"
                            value={citationLinkInput}
                            onChange={e => setCitationLinkInput(e.target.value)}
                        />
                        <button>Submit</button>
                    </form>
                );
        }
    }

    function handleCitationClick(remarkId, citationIndex) {
        onCitationClick(remarkId, citationIndex);
    }

    function parseRemarkBody(body) {
        const markup = [];

        for (let i = 0; i < body.length; i++) {
            if (body[i] === '[') {
                const citationIndex = Number(body[i + 1]) - 1
                markup.push(<span 
                    key={i}
                    style={{ 
                        color: 'blue',
                        cursor: 'grab'
                    }}
                    onClick={() => handleCitationClick(remark.id, citationIndex)}
                >[{body[i + 1]}]</span>);
                i += 2;
            } else {
                markup.push(<pre key={i} style={{ display: 'inline'}}>{body[i]}</pre>);
            }
        }

        return markup;
    }

    return (
        <>
            <p className="authorText">Author: {remark.author.username}</p>
            <div style={{ maxWidth: "30vw", wordBreak: "break-word" }}>
                {parseRemarkBody(remark.body)}
            </div>
            {!showComments ?
                <button onClick={() => setShowComments(true)}>Show Comments</button>
                :
                <button onClick={() => setShowComments(false)}>Hide Comments</button>
            }
            {showComments &&
                <CommentList comments={remark.comments} remarkId={remark.id} />
            }
            {!composing &&
                <button onClick={() => setComposing(true)}>Add Comment</button>
            }
            {citationMarkup()}
            {composing && <>
                <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <button onClick={handleSaveCommentClick}>Save</button>
                <button onClick={() => setComposing(false)}>Cancel</button>
            </>}
        </>
    )
}
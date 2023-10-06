import { useState, useEffect, useRef } from "react"
import CommentList from "./CommentList";

export default function Remark({ remark, onSaveComment, onSubmitCitation, onSelectCitationText }) {
    const [showComments, setShowComments] = useState(false);
    const [composing, setComposing] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [citationStage, setCitationStage] = useState('default');
    const [citationBodyInput, setCitationBodyInput] = useState('');
    const [citationLinkInput, setCitationLinkInput] = useState('');
    const [citationText, setCitationText] = useState('');

    function handleKeyDown(e) {
        if (e.code === 'Enter' && citationStage === 'selecting') {
            setCitationStage('composing');

            const selection = window.getSelection()
            setCitationText(selection.toString());

            onSelectCitationText(remark.id, selection);
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown, true);

        return () => { window.removeEventListener('keydown', handleKeyDown) };
    })

    function handleCitationFormSubmit(e) {
        e.preventDefault();
        setCitationStage('default');

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
                return <p>Select the text you want to add the citation to and press the 'Enter' key</p>
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

    return (
        <>
            <p style={{ maxWidth: "30vw", wordBreak: "break-word" }}>
                {remark.body}
            </p>
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
            </>}
        </>
    )
}
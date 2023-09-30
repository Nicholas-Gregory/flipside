import { useState } from "react";
import { query } from "../utils";
import CommentList from "./CommentList";

export default function Comment({ comment, onSubmitReply }) {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [composing, setComposing] = useState(false);
    const [newReply, setNewReply] = useState('');

    async function handleShowRepliesClick() {
        // Fetch replies and set showReplies to true
        const response = await query(`
            query Comment($id: String!) {
                commentById(id: $id) {
                    replies {
                        id,
                        body
                    }
                }
            }
        `, { id: comment.id });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setReplies(response.data.commentById);
        setShowReplies(true);
    }

    function handleSaveReplyClick() {
        onSubmitReply(newReply);
        setComposing(false);
        setNewReply('');
    }

    return (
        <>
            <p>{comment.body}</p>
            {!showReplies && <button onClick={handleShowRepliesClick}>Show Replies</button>}
            {showReplies && <>
                <button onClick={() => setShowReplies(false)}>Hide Replies</button>
                <CommentList comments={replies} />
            </>}
            {!composing ?
                <button onClick={() => setComposing(true)}>Add Reply</button>
            :<>
                <textarea 
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                />
                <button onClick={handleSaveReplyClick}>Save</button>
            </>}
        </>
    )
}
import { useState } from "react";
import { query } from "../utils";
import CommentList from "./CommentList";

const replyQuery = `
query Comment($id: String!) {
    commentById(id: $id) {
        replies {
            id,
            body
        }
    }
}
`;

export default function Comment({ comment, remarkId }) {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [composing, setComposing] = useState(false);
    const [newReply, setNewReply] = useState('');

    async function handleShowRepliesClick() {
        // Fetch replies and set showReplies to true
        const response = await query(replyQuery, { id: comment.id });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setReplies(response.data.commentById.replies);
        setShowReplies(true);
    }

    async function handleSaveReplyClick() {
        const response = await query(`
            mutation AddCommentReply($remarkId: String!, $body: String!, $parentId: String) {
                addComment(remarkId: $remarkId, body: $body, parentId: $parentId) {
                    id
                }
            }
        `, {remarkId, body: newReply, parentId: comment.id });

        if (response.errors) {
            alert(response.errors[0].message);
            return;
        }

        setReplies((await query(replyQuery, { id: comment.id })).data.commentById.replies);

        setComposing(false);
        setNewReply('');
    }

    return (
        <>
            <div className="commentBody">
                <p>{comment.body}</p>
            </div>
            {!showReplies && <button onClick={handleShowRepliesClick}>Show Replies</button>}
            {!composing ?
                <button onClick={() => setComposing(true)}>Add Reply</button>
            :<>
                <textarea 
                    value={newReply}
                    onChange={e => setNewReply(e.target.value)}
                />
                <button onClick={handleSaveReplyClick}>Save</button>
            </>}
            {showReplies && <>
                <button onClick={() => setShowReplies(false)}>Hide Replies</button>
                <CommentList comments={replies} remarkId={remarkId} />
            </>}
            
        </>
    )
}
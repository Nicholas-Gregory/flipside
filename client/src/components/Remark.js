import { useState } from "react"
import CommentList from "./CommentList";

export default function Remark({ remark, onSaveComment }) {
    const [showComments, setShowComments] = useState(false);
    const [composing, setComposing] = useState(false);
    const [newComment, setNewComment] = useState('');

    function handleSaveCommentClick() {
        onSaveComment(newComment, remark.id);
        setComposing(false);
        setNewComment('');
    }

    return (
        <>
            <p>
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
            {composing && <>
                <textarea 
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                />
                <button>Add Citation</button>
                <button onClick={handleSaveCommentClick}>Save</button>
            </>}
        </>
    )
}
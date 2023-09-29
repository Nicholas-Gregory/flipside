import { useState } from "react";
import { query } from "../utils";

export function Comment({ comment }) {
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);

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

        if (!response.ok) {
            alert(response.errors[0].message);
            return;
        }

        setReplies((await response.json()).data.commentById);
        setShowReplies(true);
    }

    return (
        <>
            <p>{comment.body}</p>
            {!showReplies && <button onClick={handleShowRepliesClick}>Show Replies</button>}
            {showReplies && <>
                <button onClick={() => setShowReplies(false)}>Hide Replies</button>
                <CommentList comments={replies} />
            </>}
        </>
    )
}